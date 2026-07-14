import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/context/AuthContext";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TeamFlow",
    template: "%s | TeamFlow",
  },
  description:
    "Project and Team Task Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}