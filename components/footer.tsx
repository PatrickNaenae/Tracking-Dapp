import React from "react";
import { Fot1, Fot2 } from "@/components";
import Image from "next/image";
import Link from "next/link";

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
    { name: "Twitter", href: "#" },
    { name: "Facebook", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "LinkedIn", href: "#" },
  ];

  return (
    <footer className="bg-gray-50 pt-16 pb-12">
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
              <span className="ml-2 text-xl font-semibold text-gray-800">
                Tracking
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Track your shipments and deliveries in real-time with our
              easy-to-use interface. Monitor package status, receive delivery
              notifications, and access detailed tracking.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerNav.slice(0, 3).map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerNav.slice(3).map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App Download */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
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
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} PatNae, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
