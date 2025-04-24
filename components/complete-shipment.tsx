"use client";

import { CreateShipmentProps } from "@/context/TrackingContext";
import { useState } from "react";

interface CompleteShipmentProps {
  completeShipment: (shipment: CreateShipmentProps) => Promise<void>;
  completeModal: boolean;
  setCompleteModal: (open: boolean) => void;
}

const CompleteShipment = ({
  completeShipment,
  completeModal,
  setCompleteModal,
}: CompleteShipmentProps) => {
  const [completeShip, setCompleteShip] = useState<CreateShipmentProps>({
    receiver: "",
    index: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeShipping = async () => {
    try {
      setIsSubmitting(true);
      await completeShipment(completeShip);
      setCompleteModal(false);
    } catch (error) {
      console.error("Error completing shipment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!completeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => setCompleteModal(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Complete Shipment
            </h3>
            <button
              onClick={() => setCompleteModal(false)}
              className="p-1 rounded-md hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6 text-gray-400"
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
          <p className="mt-1 text-sm text-gray-400">
            Mark a shipment as completed by providing the details below
          </p>
        </div>

        {/* Form Content */}
        <div className="px-6 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              completeShipping();
            }}
          >
            <div className="mb-4">
              <label
                htmlFor="receiver"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Receiver Address
              </label>
              <input
                id="receiver"
                type="text"
                placeholder="0x..."
                value={completeShip.receiver}
                onChange={(e) =>
                  setCompleteShip({
                    ...completeShip,
                    receiver: e.target.value,
                  })
                }
                className="w-full px-4 py-2 text-gray-700 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="shipmentId"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Shipment ID
              </label>
              <input
                id="shipmentId"
                type="number"
                placeholder="0"
                min="0"
                value={completeShip.index}
                onChange={(e) =>
                  setCompleteShip({
                    ...completeShip,
                    index: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 text-gray-700 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setCompleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                disabled={isSubmitting || !completeShip.receiver}
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
                    Processing...
                  </>
                ) : (
                  "Complete Shipment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteShipment;
