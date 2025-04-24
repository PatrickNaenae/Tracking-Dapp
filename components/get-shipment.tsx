"use client";

import { Shipment } from "@/context/TrackingContext";
import { convertTime } from "@/utils/lib";
import { useState } from "react";

interface GetShipmentProps {
  getShipment: (index: number) => Promise<Shipment | undefined>;
  getModal: boolean;
  setGetModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const GetShipment = ({
  getShipment,
  getModal,
  setGetModal,
}: GetShipmentProps) => {
  const [index, setIndex] = useState(0);
  const [shipmentData, setShipmentData] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetShipment = async () => {
    try {
      setIsLoading(true);
      const data = await getShipment(index);
      setShipmentData(data || null);
    } catch (error) {
      console.error("Error fetching shipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!getModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-70 transition-opacity"
        onClick={() => {
          setGetModal(false);
          setShipmentData(null);
        }}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Track Shipment Details
            </h3>
            <button
              onClick={() => {
                setGetModal(false);
                setShipmentData(null);
              }}
              className="p-1 rounded-md hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGetShipment();
            }}
            className="mb-6"
          >
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label
                  htmlFor="shipmentId"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Shipment ID
                </label>
                <input
                  id="shipmentId"
                  type="number"
                  min="0"
                  value={index}
                  onChange={(e) => setIndex(Number(e.target.value))}
                  placeholder="Enter shipment ID"
                  className="w-full px-4 py-2 text-gray-700 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  "Get Details"
                )}
              </button>
            </div>
          </form>

          {/* Shipment Details */}
          {shipmentData && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Shipment Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
                <div>
                  <p className="text-sm font-medium text-zinc-400">Sender</p>
                  <p className="text-white font-mono">
                    {shipmentData.sender.slice(0, 6)}...
                    {shipmentData.sender.slice(-4)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400">Receiver</p>
                  <p className="text-white font-mono">
                    {shipmentData.receiver.slice(0, 6)}...
                    {shipmentData.receiver.slice(-4)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400">
                    Pickup Time
                  </p>
                  <p className="text-white">
                    {convertTime(Number(shipmentData.pickupTime))}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400">
                    Delivery Time
                  </p>
                  <p className="text-white">
                    {shipmentData.deliveryTime
                      ? convertTime(Number(shipmentData.deliveryTime))
                      : "Not delivered"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400">Distance</p>
                  <p className="text-white">
                    {shipmentData.distance.toString()} km
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400">Price</p>
                  <p className="text-white">
                    ${Number(shipmentData.price).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      shipmentData.status === BigInt(0)
                        ? "bg-zinc-700 text-zinc-300"
                        : shipmentData.status === BigInt(1)
                        ? "bg-blue-800 text-blue-200"
                        : "bg-green-800 text-green-200"
                    }`}
                  >
                    {shipmentData.status === BigInt(0)
                      ? "Pending"
                      : shipmentData.status === BigInt(1)
                      ? "In Transit"
                      : "Delivered"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400">Payment</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      shipmentData.isPaid
                        ? "bg-green-800 text-green-200"
                        : "bg-yellow-800 text-yellow-200"
                    }`}
                  >
                    {shipmentData.isPaid ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetShipment;
