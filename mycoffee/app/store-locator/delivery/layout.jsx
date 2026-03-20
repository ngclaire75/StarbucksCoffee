"use client";

import { SessionProvider } from "next-auth/react";

export default function DeliveryLayout({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}