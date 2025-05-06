// Fix: Import React as a default export instead of a type
// something's wrong with this layout
import React, { ReactNode } from "react";
import "@/app/globals.css"
import { Inter } from "next/font/google"
import ToasterClient from "@/components/toasterClient";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SmartCheck - Attendance Dashboard",
  description: "Create and manage attendance reports for courses",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}> 
        {children}
        <ToasterClient />
      </body>
    </html>
  )
}
