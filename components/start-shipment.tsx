"use client";

import { useState } from "react";
import { CreateShipmentProps } from "@/context/TrackingContext";
import Str1 from "./SVG/Str1";

interface StartShipmentProps {
  startShipment: (shipment: CreateShipmentProps) => Promise<void>;
  startModal: boolean;
  setStartModal: (open: boolean) => void;
}

const StartShipment = ({
  startShipment,
  startModal,
  setStartModal,
}: StartShipmentProps) => {
  const [getProduct, setGetProduct] = useState<CreateShipmentProps>({
    receiver: "",
    index: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startShipping = async () => {
    try {
      setIsSubmitting(true);
      await startShipment(getProduct);
      setStartModal(false);
    } catch (error) {
      console.error("Error starting shipment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!startModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => setStartModal(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Start New Shipment
            </h3>
            <button
              onClick={() => setStartModal(false)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <Str1 />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Begin tracking a shipment by entering the details below
          </p>
        </div>

        {/* Form Content */}
        <div className="px-6 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              startShipping();
            }}
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="receiver"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Receiver Address
                </label>
                <input
                  id="receiver"
                  type="text"
                  placeholder="Enter receiver's wallet address (0x...)"
                  className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={getProduct.receiver}
                  onChange={(e) =>
                    setGetProduct({ ...getProduct, receiver: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="shipmentIndex"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Shipment Index
                </label>
                <input
                  id="shipmentIndex"
                  type="number"
                  min="0"
                  placeholder="Enter shipment index"
                  className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={getProduct.index}
                  onChange={(e) =>
                    setGetProduct({
                      ...getProduct,
                      index: Number(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setStartModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                disabled={isSubmitting || !getProduct.receiver}
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
                    Starting...
                  </>
                ) : (
                  "Start Shipment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StartShipment;
