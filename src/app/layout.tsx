import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WorkspaceProvider } from "@/lib/workspace/WorkspaceContext";
import { AppShell } from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SKILLAX AI — Future Workforce Intelligence & Career OS",
  description: "Explainable, deterministic career intelligence and lifelong learning operating system for the Malaysian workforce.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <WorkspaceProvider>
          <AppShell>
            {children}
          </AppShell>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
