"use client";

import { Items } from "@/context/TrackingContext";
import { useState } from "react";

interface FormProps {
  createShipment: (shipmentData: Items) => Promise<void>;
  setCreateShipmentModal: (open: boolean) => void;
  createShipmentModal: boolean;
}

const Form = ({
  createShipment,
  setCreateShipmentModal,
  createShipmentModal,
}: FormProps) => {
  const [shipment, setShipment] = useState<Items>({
    receiver: "",
    pickupTime: BigInt(0),
    distance: BigInt(0),
    price: BigInt(0),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickupInput, setPickupInput] = useState("");

  const handlePickupChange = (datetimeStr: string) => {
    setPickupInput(datetimeStr);
    const timestamp = new Date(datetimeStr).getTime();
    if (!isNaN(timestamp)) {
      setShipment({
        ...shipment,
        pickupTime: BigInt(Math.floor(timestamp / 1000)),
      });
    }
  };

  const createShipmentHandler = async () => {
    if (shipment.pickupTime <= 0) {
      alert("Pickup time must be in the future!");
      return;
    }
    try {
      setIsSubmitting(true);
      await createShipment(shipment);
      setCreateShipmentModal(false);
    } catch (error) {
      console.error("Error creating shipment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!createShipmentModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={() => setCreateShipmentModal(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-gray-900 text-gray-200 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Create New Shipment</h3>
              <p className="mt-1 text-sm text-gray-400">
                Track your product with real-time updates
              </p>
            </div>
            <button
              onClick={() => setCreateShipmentModal(false)}
              className="p-1 rounded-md hover:bg-gray-800 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
              createShipmentHandler();
            }}
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="receiver"
                  className="block text-sm font-medium mb-1"
                >
                  Receiver Address
                </label>
                <input
                  id="receiver"
                  type="text"
                  placeholder="0x123..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={shipment.receiver}
                  onChange={(e) =>
                    setShipment({ ...shipment, receiver: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="pickupTime"
                  className="block text-sm font-medium mb-1"
                >
                  Pickup Time
                </label>
                <input
                  id="pickupTime"
                  type="datetime-local"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={pickupInput}
                  onChange={(e) => handlePickupChange(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="distance"
                  className="block text-sm font-medium mb-1"
                >
                  Distance (km)
                </label>
                <input
                  id="distance"
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={shipment.distance.toString()}
                  onChange={(e) =>
                    setShipment({
                      ...shipment,
                      distance: BigInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium mb-1"
                >
                  Price (wei)
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={shipment.price.toString()}
                  onChange={(e) =>
                    setShipment({
                      ...shipment,
                      price: BigInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setCreateShipmentModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting || !shipment.receiver}
              >
                {isSubmitting ? (
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
                    Creating...
                  </>
                ) : (
                  "Create Shipment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
