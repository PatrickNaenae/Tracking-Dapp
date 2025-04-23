// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/// @title Tracking Contract
/// @notice Handles shipment creation, status tracking, and payment between sender and receiver.
contract Tracking {
    // Enum representing shipment lifecycle states
    enum ShipmentStatus {
        PENDING, // Shipment is created but not yet started
        IN_TRANSIT, // Shipment is on the way
        DELIVERED // Shipment has been completed
    }

    // Struct representing a shipment associated with a specific sender
    struct Shipment {
        address sender;
        address receiver;
        uint256 pickupTime;
        uint256 deliveryTime;
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool isPaid;
    }

    // Mapping from sender to an array of their shipments
    mapping(address => Shipment[]) public shipments;

    // Total number of shipments ever created
    uint256 public shipmentCount;

    // Struct used for keeping a global list of all shipments (across all senders)
    struct TypeShipment {
        address sender;
        address receiver;
        uint256 pickupTime;
        uint256 deliveryTime;
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool isPaid;
    }

    // Array holding all shipments globally (indexed by order of creation)
    TypeShipment[] typeShipments;

    // Event emitted when a shipment is created
    event ShipmentCreated(
        address indexed sender,
        address indexed receiver,
        uint256 pickupTime,
        uint256 distance,
        uint256 price
    );

    // Event emitted when a shipment status changes to IN_TRANSIT
    event ShipmentInTransit(
        address indexed sender,
        address indexed receiver,
        uint256 pickupTime
    );

    // Event emitted when a shipment status changes to DELIVERED
    event ShipmentDelivered(
        address indexed sender,
        address indexed receiver,
        uint256 deliveryTime
    );

    // Event emitted when the shipment sender is paid after delivery
    event ShipmentPaid(
        address indexed sender,
        address indexed receiver,
        uint256 amount
    );

    constructor() {
        shipmentCount = 0;
    }

    /// @notice Creates a new shipment and stores it for sender and globally
    /// @param _receiver The recipient of the shipment
    /// @param _pickupTime Scheduled pickup timestamp
    /// @param _distance Distance in arbitrary units (e.g., km)
    /// @param _price Expected payment amount
    function createShipment(
        address _receiver,
        uint256 _pickupTime,
        uint256 _distance,
        uint256 _price
    ) external payable {
        require(msg.value >= _price, "Amount not enough");

        // Create the shipment for sender-specific tracking
        Shipment memory shipment = Shipment(
            msg.sender,
            _receiver,
            _pickupTime,
            0, // deliveryTime not yet known
            _distance,
            _price,
            ShipmentStatus.PENDING,
            false
        );

        // Store the shipment in the sender's shipment history
        shipments[msg.sender].push(shipment);
        shipmentCount++;

        // Also store in global list for analytics, public browsing, etc.
        typeShipments.push(
            TypeShipment(
                msg.sender,
                _receiver,
                _pickupTime,
                0,
                _distance,
                _price,
                ShipmentStatus.PENDING,
                false
            )
        );

        // Emit creation event
        emit ShipmentCreated(
            msg.sender,
            _receiver,
            _pickupTime,
            _distance,
            _price
        );
    }

    /// @notice Marks a shipment as in transit
    /// @param _sender Address of the shipment sender
    /// @param _receiver Address of the shipment receiver
    /// @param index Index of the shipment in sender's list
    function startShipment(
        address _sender,
        address _receiver,
        uint256 index
    ) external {
        Shipment storage shipment = shipments[_sender][index];
        TypeShipment storage typeShipment = typeShipments[index];

        require(shipment.receiver == _receiver, "Invalid Receiver");
        require(
            shipment.status == ShipmentStatus.PENDING,
            "Shipment is already in transit"
        );

        shipment.status = ShipmentStatus.IN_TRANSIT;
        typeShipment.status = ShipmentStatus.IN_TRANSIT;

        emit ShipmentInTransit(_sender, _receiver, shipment.pickupTime);
    }

    /// @notice Completes the shipment, updates delivery time and pays the sender
    /// @param _sender Address of the shipment sender
    /// @param _receiver Address of the shipment receiver
    /// @param index Index of the shipment in sender's list
    function completeShipment(
        address _sender,
        address _receiver,
        uint256 index
    ) external {
        Shipment storage shipment = shipments[_sender][index];
        TypeShipment storage typeShipment = typeShipments[index];

        require(shipment.receiver == _receiver, "Invalid Receiver");
        require(
            shipment.status == ShipmentStatus.IN_TRANSIT,
            "Shipment not in transit"
        );
        require(!shipment.isPaid, "Payment already made");

        // Mark as delivered and set delivery time
        shipment.status = ShipmentStatus.DELIVERED;
        typeShipment.status = ShipmentStatus.DELIVERED;
        shipment.deliveryTime = block.timestamp;
        typeShipment.deliveryTime = block.timestamp;

        uint256 amount = shipment.price;

        // Pay the sender
        payable(shipment.sender).transfer(amount);

        shipment.isPaid = true;
        typeShipment.isPaid = true;

        // Emit delivery and payment events
        emit ShipmentDelivered(_sender, _receiver, shipment.deliveryTime);
        emit ShipmentPaid(_sender, _receiver, amount);
    }

    /// @notice Returns shipment details by sender and index
    function getShipment(
        address _sender,
        uint256 index
    )
        public
        view
        returns (
            address,
            address,
            uint256,
            uint256,
            uint256,
            uint256,
            ShipmentStatus,
            bool
        )
    {
        Shipment memory shipment = shipments[_sender][index];
        return (
            shipment.sender,
            shipment.receiver,
            shipment.pickupTime,
            shipment.deliveryTime,
            shipment.distance,
            shipment.price,
            shipment.status,
            shipment.isPaid
        );
    }

    /// @notice Returns total number of shipments created by a sender
    function getShipmentCount(address _sender) public view returns (uint256) {
        return shipments[_sender].length;
    }

    /// @notice Returns all shipments in the global list (not sender-specific)
    function getAllTransactions() public view returns (TypeShipment[] memory) {
        return typeShipments;
    }
}
