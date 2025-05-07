// Fix: Import React as a default export (required for JSX) and ReactNode type separately
// See: React uses a default export for the library and named exports for types [[1]][[2]]
import React, { ReactNode } from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import ToasterClient from "@/components/toasterClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SmartCheck - Attendance Dashboard",
  description: "Create and manage attendance reports for courses",
};

// Fix: Type the `children` prop explicitly to avoid TypeScript "implicit 'any'" error
// Use `ReactNode` to ensure type safety for all valid React child types [[8]]
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
      <ToasterClient />
    </div>
  );
}