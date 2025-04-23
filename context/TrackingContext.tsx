"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import { Tracking, Tracking__factory } from "@/typechain-types";
import { EIP1193Provider } from "hardhat/types";

// Declare the Ethereum provider globally so we can access MetaMask
declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

// Define types for the shipment input and output structures
export interface Items {
  receiver: string;
  pickupTime: bigint;
  distance: bigint;
  price: bigint;
}

export interface Shipment {
  sender: string;
  receiver: string;
  pickupTime: bigint;
  deliveryTime: bigint;
  distance: bigint;
  price: bigint;
  status: bigint;
  isPaid: boolean;
}

// Type for methods that take receiver and index
export interface CreateShipmentProps {
  receiver: string;
  index: number;
}

// Context interface defining all functionalities provided
interface TrackingContextType {
  currentUser: string;
  createShipment: (items: Items) => Promise<void>;
  getAllShipments: () => Promise<Shipment[] | undefined>;
  getAllShipmentsCount: () => Promise<bigint | undefined>;
  completeShipment: (shipment: CreateShipmentProps) => Promise<void>;
  getShipment: (index: number) => Promise<Shipment | undefined>;
  startShipment: (shipment: CreateShipmentProps) => Promise<void>;
  connectWallet: () => Promise<void>;
  DappName: string;
}

// Create the actual context
export const TrackingContext = createContext<TrackingContextType | null>(null);

// Provider component to wrap around your app's components
export const TrackingProvider = ({ children }: { children: ReactNode }) => {
  const DappName = "Product Tracking Dapp"; // Name shown in the app
  const [currentUser, setCurrentUser] = useState("");

  // Helper function to get contract instance with signer or provider
  const fetchContract = async (
    signerOrProvider: ethers.Signer | ethers.Provider
  ): Promise<Tracking> => {
    return Tracking__factory.connect(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      signerOrProvider
    );
  };

  // Function to create a new shipment and send payment
  const createShipment = async (items: Items) => {
    const { receiver, pickupTime, distance, price } = items;
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = await fetchContract(signer);

      const createItem = await contract.createShipment(
        receiver,
        pickupTime,
        distance,
        price,
        {
          value: price,
        }
      );
      await createItem.wait(); // Wait for the transaction to complete
    } catch (error) {
      console.error("Error creating shipment:", error);
    }
  };

  // Fetch all shipment transactions across all users
  const getAllShipments = async (): Promise<Shipment[] | undefined> => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      // 2. Request accounts if not already connected
      const accounts = await window.ethereum.request({
        method: "eth_accounts", // Changed from eth_accounts to request access
      });

      // 3. Validate we have an account
      if (!accounts || accounts.length === 0) {
        return undefined;
      }

      const provider = new ethers.BrowserProvider(
        window.ethereum as EIP1193Provider
      ); // Use BrowserProvider
      const contract = await fetchContract(provider);

      // Alternative approach if getAllTransactions fails
      const shipmentCount = await contract.shipmentCount();
      const shipments: Shipment[] = [];

      for (let i = 0; i < shipmentCount; i++) {
        const shipment = await contract.getShipment(accounts[0], i);
        shipments.push({
          sender: shipment[0],
          receiver: shipment[1],
          pickupTime: shipment[2],
          deliveryTime: shipment[3],
          distance: shipment[4],
          price: shipment[5],
          status: shipment[6],
          isPaid: shipment[7],
        });
      }

      return shipments;
    } catch (error) {
      console.error("Error fetching shipments:", error);
      return undefined;
    }
  };

  // Get the number of shipments sent by the current connected wallet
  const getAllShipmentsCount = async (): Promise<bigint | undefined> => {
    try {
      // 1. Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      // 2. Request accounts if not already connected
      const accounts = await window.ethereum.request({
        method: "eth_accounts", // Changed from eth_accounts to request access
      });

      // 3. Validate we have an account
      if (!accounts || accounts.length === 0) {
        return undefined;
      }

      const provider = new ethers.BrowserProvider(window.ethereum); // Use BrowserProvider
      const contract = await fetchContract(provider);

      // 4. Validate address before calling contract
      if (!ethers.isAddress(accounts[0])) {
        throw new Error("Invalid Ethereum address");
      }

      const count = await contract.getShipmentCount(accounts[0]);
      return count;
    } catch (error) {
      console.error("Error fetching shipments count:", error);
      // You might want to show a user-friendly error message here
      return undefined;
    }
  };

  // Complete a shipment (e.g., deliver and pay the sender)
  const completeShipment = async (shipment: CreateShipmentProps) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      const { receiver, index } = shipment;
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = await fetchContract(signer);

      const tx = await contract.completeShipment(accounts[0], receiver, index, {
        gasLimit: 300000,
      });
      await tx.wait();
    } catch (error) {
      console.error("Error completing shipment:", error);
    }
  };

  // Fetch a single shipment based on wallet address and index
  const getShipment = async (index: number): Promise<Shipment | undefined> => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const provider = new ethers.JsonRpcProvider();
      const contract = await fetchContract(provider);
      const shipment = await contract.getShipment(accounts[0], index);

      return {
        sender: shipment[0],
        receiver: shipment[1],
        pickupTime: shipment[2],
        deliveryTime: shipment[3],
        distance: shipment[4],
        price: shipment[5],
        status: shipment[6],
        isPaid: shipment[7],
      };
    } catch (error) {
      console.error("Error getting shipment:", error);
    }
  };

  // Mark a shipment as started (moving from PENDING to IN_TRANSIT)
  const startShipment = async (shipment: CreateShipmentProps) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      const { receiver, index } = shipment;
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = await fetchContract(signer);

      const tx = await contract.startShipment(accounts[0], receiver, index);
      await tx.wait();
    } catch (error) {
      console.error("Error starting shipment:", error);
    }
  };

  // Check if a wallet is already connected when the page loads
  const checkIfWalletConnected = useCallback(async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentUser(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  }, []);

  // Trigger MetaMask connection popup and save the selected wallet
  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentUser(accounts[0]);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  }, []);

  // Check wallet connection status on component mount
  useEffect(() => {
    checkIfWalletConnected();
  }, [checkIfWalletConnected]);

  // Provide all context values to the children of this provider
  return (
    <TrackingContext.Provider
      value={{
        connectWallet,
        createShipment,
        getAllShipments,
        getAllShipmentsCount,
        completeShipment,
        getShipment,
        startShipment,
        currentUser,
        DappName,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
