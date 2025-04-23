"use client";

import { Shipment } from "@/context/TrackingContext";
import { convertTime } from "@/utils/lib";

interface TableProps {
  setCreateShipmentModal: (open: boolean) => void;
  allShipmentData: Shipment[] | null;
}

const Table = ({ setCreateShipmentModal, allShipmentData }: TableProps) => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
        <div className="max-w-2xl">
          <h3 className="text-2xl font-bold text-white">Shipment Tracking</h3>
          <p className="mt-2 text-white">
            Manage and monitor all your shipments in one place
          </p>
        </div>
        <button
          onClick={() => setCreateShipmentModal(true)}
          className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Shipment
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Sender",
                  "Receiver",
                  "Pickup Time",
                  "Distance",
                  "Price",
                  "Delivery Time",
                  "Payment",
                  "Status",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allShipmentData?.length ? (
                allShipmentData.map((shipment, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className="font-mono">
                        {shipment.sender.slice(0, 6)}...
                        {shipment.sender.slice(-4)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-mono">
                        {shipment.receiver.slice(0, 6)}...
                        {shipment.receiver.slice(-4)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {convertTime(Number(shipment.pickupTime))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.distance.toString()} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${Number(shipment.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.deliveryTime
                        ? convertTime(Number(shipment.deliveryTime))
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          shipment.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {shipment.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          shipment.status === BigInt(0)
                            ? "bg-gray-100 text-gray-800"
                            : shipment.status === BigInt(1)
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {shipment.status === BigInt(0)
                          ? "Pending"
                          : shipment.status === BigInt(1)
                          ? "In Transit"
                          : "Delivered"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No shipments found. Create your first shipment to get
                    started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
