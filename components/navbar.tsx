"use client";

import { useState, useEffect, useContext } from "react";
import { TrackingContext } from "@/context/TrackingContext";
import { Loader, Nav1, Nav2, Nav3 } from "@/components";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const contextValue = useContext(TrackingContext);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".menu-btn")) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (!contextValue) {
    return <Loader />;
  }

  const { currentUser, connectWallet } = contextValue;

  const navigationItems = [
    { name: "Home", path: "#" },
    { name: "Services", path: "#" },
    { name: "Contact Us", path: "#" },
    { name: "Blog", path: "#" },
  ];

  return (
    <nav
      className={`bg-gray-900 text-white pb-5 md:text-sm ${
        openProfile
          ? "shadow-lg rounded-xl border border-gray-700 mx-2 mt-2 md:shadow-none md:border-none md:mx-0 md:mt-0"
          : ""
      }`}
    >
      <div className="gap-x-14 items-center mx-auto max-w-screen-xl px-4 md:flex md:px-8">
        <div className="flex items-center justify-between py-5 md:block">
          <Link href="#">
            <span className="sr-only">Logo</span>
            <Image
              src="/images/tracking.png"
              width={150}
              height={70}
              className="h-24 w-auto"
              alt="Logo"
            />
          </Link>
          <div className="md:hidden">
            <button
              type="button"
              className="menu-btn text-gray-400 hover:text-white"
              onClick={() => setOpenProfile(!openProfile)}
            >
              <span className="sr-only">Open main menu</span>
              {openProfile ? <Nav1 /> : <Nav2 />}
            </button>
          </div>
        </div>
        <div
          className={`flex-1 items-center mt-8 md:mt-0 md:flex ${
            openProfile ? "block" : "hidden"
          }`}
        >
          <ul className="justify-center items-center space-y-6 md:flex md:space-x-8 md:space-y-0">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0">
            {currentUser ? (
              <p className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-full md:inline-flex">
                {currentUser.slice(0, 6)}...
                {currentUser.slice(currentUser.length - 4)}
              </p>
            ) : (
              <button
                type="button"
                className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-full md:inline-flex"
                onClick={connectWallet}
              >
                Connect Wallet <Nav3 />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
