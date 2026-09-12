import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "إتمام الحجز | القلوب الرحيمة",
};

export default function BookingPage() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] bg-brand-cream-100">
        <BookingForm />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
