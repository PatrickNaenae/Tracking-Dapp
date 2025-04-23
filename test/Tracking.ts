import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { Tracking, Tracking__factory } from "@/typechain-types";

describe("Tracking", function () {
  let TrackingFactory: Tracking__factory;
  let tracking: Tracking;
  let owner: SignerWithAddress;
  let sender: SignerWithAddress;
  let receiver: SignerWithAddress;
  let addr1: SignerWithAddress,
    addr2: SignerWithAddress,
    addr3: SignerWithAddress;

  // Deploys a new Tracking contract and gets signers before each test
  beforeEach(async function () {
    [owner, sender, receiver, addr1, addr2, addr3] = await ethers.getSigners();
    TrackingFactory = (await ethers.getContractFactory(
      "Tracking"
    )) as Tracking__factory;
    tracking = await TrackingFactory.deploy();
  });

  // === Deployment Tests ===
  describe("Deployment", function () {
    it("Should initialize with zero shipments", async function () {
      expect(await tracking.shipmentCount()).to.equal(0);
    });
  });

  // === Shipment Creation Tests ===
  describe("Shipment Creation", function () {
    it("Should create a new shipment", async function () {
      const pickupTime = Math.floor(Date.now() / 1000) + 86400; // Tomorrow
      const distance = 100;
      const price = ethers.parseEther("1.0");

      // Expect ShipmentCreated event and incremented shipment count
      await expect(
        tracking
          .connect(sender)
          .createShipment(receiver.address, pickupTime, distance, price, {
            value: price,
          })
      )
        .to.emit(tracking, "ShipmentCreated")
        .withArgs(
          sender.address,
          receiver.address,
          pickupTime,
          distance,
          price
        );

      expect(await tracking.shipmentCount()).to.equal(1);
      expect(await tracking.getShipmentCount(sender.address)).to.equal(1);
    });

    it("Should fail if payment is insufficient", async function () {
      const pickupTime = Math.floor(Date.now() / 1000) + 86400;
      const distance = 100;
      const price = ethers.parseEther("1.0");

      // Should revert due to insufficient value sent
      await expect(
        tracking
          .connect(sender)
          .createShipment(receiver.address, pickupTime, distance, price, {
            value: ethers.parseEther("0.5"),
          })
      ).to.be.revertedWith("Amount not enough");
    });
  });

  // === Shipment Processing Tests ===
  describe("Shipment Processing", function () {
    let pickupTime: number;
    let distance: number;
    let price: bigint;

    // Creates a shipment before each test in this block
    beforeEach(async function () {
      pickupTime = Math.floor(Date.now() / 1000) + 86400;
      distance = 100;
      price = ethers.parseEther("1.0");

      await tracking
        .connect(sender)
        .createShipment(receiver.address, pickupTime, distance, price, {
          value: price,
        });
    });

    it("Should start shipment", async function () {
      // Start shipment and check the event and updated status
      await expect(
        tracking
          .connect(owner)
          .startShipment(sender.address, receiver.address, 0)
      )
        .to.emit(tracking, "ShipmentInTransit")
        .withArgs(sender.address, receiver.address, pickupTime);

      const shipment = await tracking.getShipment(sender.address, 0);
      const [status] = shipment;
      expect(status).to.equal(1); // IN_TRANSIT
    });

    it("Should fail to start shipment with invalid receiver", async function () {
      // Receiver mismatch should revert
      await expect(
        tracking.connect(owner).startShipment(sender.address, addr1.address, 0)
      ).to.be.revertedWith("Invalid Receiver");
    });

    it("Should fail to start already started shipment", async function () {
      await tracking
        .connect(owner)
        .startShipment(sender.address, receiver.address, 0);

      // Second attempt should revert
      await expect(
        tracking
          .connect(owner)
          .startShipment(sender.address, receiver.address, 0)
      ).to.be.revertedWith("Shipment is already in transit");
    });

    it("Should complete shipment", async function () {
      await tracking
        .connect(owner)
        .startShipment(sender.address, receiver.address, 0);

      const senderBalanceBefore = await ethers.provider.getBalance(
        sender.address
      );

      // Complete shipment and wait for receipt to get gas usage
      const tx = await tracking
        .connect(owner)
        .completeShipment(sender.address, receiver.address, 0);
      const receipt = await tx.wait();
      if (!receipt) throw new Error("Transaction failed (no receipt)");

      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const senderBalanceAfter = await ethers.provider.getBalance(
        sender.address
      );

      // Validate sender receives correct payment minus gas (approximate)
      expect(senderBalanceAfter).to.equal(
        senderBalanceBefore + price - gasUsed
      );

      const shipment = await tracking.getShipment(sender.address, 0);
      const [status, isPaid] = shipment;
      expect(status).to.equal(2); // DELIVERED
      expect(isPaid).to.equal(true);
    });

    it("Should fail to complete non-transit shipment", async function () {
      await expect(
        tracking
          .connect(owner)
          .completeShipment(sender.address, receiver.address, 0)
      ).to.be.revertedWith("Shipment not in transit");
    });

    it("Should fail to complete shipment with invalid receiver", async function () {
      await tracking
        .connect(owner)
        .startShipment(sender.address, receiver.address, 0);

      // Wrong receiver should trigger revert
      await expect(
        tracking
          .connect(owner)
          .completeShipment(sender.address, addr1.address, 0)
      ).to.be.revertedWith("Invalid Receiver");
    });

    it("Should fail to complete already paid shipment", async function () {
      await tracking
        .connect(owner)
        .startShipment(sender.address, receiver.address, 0);
      await tracking
        .connect(owner)
        .completeShipment(sender.address, receiver.address, 0);

      // Attempting second completion should revert
      await expect(
        tracking
          .connect(owner)
          .completeShipment(sender.address, receiver.address, 0)
      ).to.be.revertedWith("Payment already made");
    });
  });

  // === View Function Tests ===
  describe("View Functions", function () {
    let pickupTime: number;
    let distance: number;
    let price: bigint;

    // Create multiple shipments for different addresses
    beforeEach(async function () {
      pickupTime = Math.floor(Date.now() / 1000) + 86400;
      distance = 100;
      price = ethers.parseEther("1.0");

      await tracking
        .connect(sender)
        .createShipment(receiver.address, pickupTime, distance, price, {
          value: price,
        });

      await tracking
        .connect(sender)
        .createShipment(
          addr1.address,
          pickupTime + 100,
          distance + 50,
          price * 2n,
          { value: price * 2n }
        );

      await tracking
        .connect(addr2)
        .createShipment(
          addr3.address,
          pickupTime + 200,
          distance + 100,
          price * 2n,
          { value: price * 2n }
        );
    });

    it("Should return correct shipment count", async function () {
      // Validate sender-wise shipment count
      expect(await tracking.getShipmentCount(sender.address)).to.equal(2);
      expect(await tracking.getShipmentCount(addr2.address)).to.equal(1);
      expect(await tracking.getShipmentCount(addr3.address)).to.equal(0);
    });

    it("Should return correct shipment details", async function () {
      const shipment = await tracking.getShipment(sender.address, 0);

      const [
        senderAddress,
        receiverAddress,
        pickupTimeValue,
        distanceValue,
        priceValue,
        status,
        isPaid,
      ] = shipment;

      // Assert shipment matches expected values
      expect(senderAddress).to.equal(sender.address);
      expect(receiverAddress).to.equal(receiver.address);
      expect(pickupTimeValue).to.equal(pickupTime);
      expect(distanceValue).to.equal(distance);
      expect(priceValue).to.equal(price);
      expect(status).to.equal(0); // PENDING
      expect(isPaid).to.equal(false);
    });

    it("Should return all transactions", async function () {
      const transactions = await tracking.getAllTransactions();

      expect(transactions.length).to.equal(3);
      expect(transactions[0].sender).to.equal(sender.address);
      expect(transactions[1].sender).to.equal(sender.address);
      expect(transactions[2].sender).to.equal(addr2.address);
    });
  });
});
