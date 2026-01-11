import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";
import Navbar from "@/components/shared/Navbar";
import SidebarNav from "@/components/shared/SidebarNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Permit Management System",
  description: "Professional permit processing and document management system for city officials and citizens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${roboto.variable} antialiased bg-gray-50`} style={{ fontFamily: 'var(--font-inter), var(--font-roboto), system-ui, sans-serif' }}>
        <RoleProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1">
              <SidebarNav />
              <main className="flex-1 p-4 lg:p-6">
                {children}
              </main>
            </div>
          </div>
        </RoleProvider>
      </body>
    </html>
  );
}
