import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TranslatorClient from "@/components/translator/TranslatorClient";
import { Suspense } from "react";

export default function LinguaLensPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-20 pb-12 flex items-center justify-center p-4">
        <Suspense fallback={<div className="text-center">Loading Translator...</div>}>
          <TranslatorClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
