"use client";

import { useState, useEffect } from "react";
import { avatar } from "@/public/Images";
import Image from "next/image";
import Link from "next/link";

interface ProfileProps {
  openProfile: boolean;
  setOpenProfile: (open: boolean) => void;
  currentUser: string;
  getAllShipmentsCount: () => Promise<bigint | undefined>;
}

const Profile = ({
  openProfile,
  setOpenProfile,
  currentUser,
  getAllShipmentsCount,
}: ProfileProps) => {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (openProfile) {
        setIsLoading(true);
        try {
          const data = await getAllShipmentsCount();
          setCount(data ? Number(data) : 0); // Handle undefined case
        } catch (error) {
          console.error("Error fetching shipment count:", error);
          setCount(0); // Fallback to 0 on error
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [openProfile, getAllShipmentsCount]);

  if (!openProfile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => setOpenProfile(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setOpenProfile(false)}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close profile"
        >
          <svg
            className="w-6 h-6 text-gray-500 dark:text-gray-400"
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

        {/* Profile Content */}
        <div className="p-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 mb-4">
              <Image
                src={avatar}
                alt="User Avatar"
                fill
                className="rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-700"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Welcome Trader
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {currentUser}
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Balance
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white mt-1">
                2,000,000 ETH
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Total Shipments
              </p>
              {isLoading ? (
                <div className="animate-pulse h-7 w-full bg-gray-200 dark:bg-gray-600 rounded mt-1" />
              ) : (
                <p className="text-xl font-semibold text-gray-800 dark:text-white mt-1">
                  {count !== null ? count.toString() : "Loading..."}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <Link
              href="#"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-center transition-colors"
            >
              View Shipments
            </Link>
            <Link
              href="#"
              className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg text-center transition-colors"
            >
              Account Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
