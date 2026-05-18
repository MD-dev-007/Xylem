"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP ?? "91XXXXXXXXXX";
  const href = `https://wa.me/${phone}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group fixed bottom-5 right-5 z-50 inline-flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <motion.span
        animate={{ opacity: [0, 1, 0], scale: [1, 1.4, 1.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        className="absolute h-14 w-14 rounded-full bg-green-500/40"
      />
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
        <Phone size={22} />
      </span>
      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-md bg-primary px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}
