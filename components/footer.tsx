import React from "react";
import { Fot1, Fot2 } from "@/components";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  const footerNav = [
    { href: "#", name: "Terms" },
    { href: "#", name: "License" },
    { href: "#", name: "Privacy" },
    { href: "#", name: "Contact Us" },
    { href: "#", name: "About" },
    { href: "#", name: "FAQ" },
  ];

  const socialLinks = [
    { name: "Twitter", href: "#", icon: <FaXTwitter size={20} /> },
    { name: "Facebook", href: "#", icon: <FaFacebookF size={20} /> },
    { name: "Instagram", href: "#", icon: <FaInstagram size={20} /> },
    { name: "LinkedIn", href: "#", icon: <FaLinkedinIn size={20} /> },
  ];

  return (
    <footer className="bg-gray-950 pt-16 pb-12 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <Image
                src="/images/tracking.png"
                width={120}
                height={50}
                className="h-24 w-auto"
                alt="Tracking Logo"
              />
              <span className="ml-2 text-xl font-semibold text-white">
                Tracking
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Track your shipments and deliveries in real-time with our
              easy-to-use interface. Monitor package status, receive delivery
              notifications, and access detailed tracking.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerNav.slice(0, 3).map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerNav.slice(3).map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App Download */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Get the App
            </h3>
            <div className="space-y-3">
              <Link href="#" className="block">
                <Fot1 />
              </Link>
              <Link href="#" className="block">
                <Fot2 />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} Patrick Naenae, Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
