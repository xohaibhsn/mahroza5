import type { ReactNode } from "react";
import CallButton from "@/components/CallButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CallButton />
      <WhatsAppButton />
    </div>
  );
}
