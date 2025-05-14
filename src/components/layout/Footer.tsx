"use client";

import Link from "next/link";
import { Languages } from "lucide-react";
import { useState, useEffect } from "react";
import { InfoModal } from "@/components/common/InfoModal";
import { MODAL_CONTENT, ModalType } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const footerLinks: { label: string; modal: ModalType }[] = [
  { label: "About", modal: "about" },
  { label: "Privacy Policy", modal: "privacy" },
  { label: "Licensing", modal: "licensing" },
  { label: "Contact", modal: "contact" },
];

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  const openModal = (modalType: ModalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <footer className="border-t bg-background">
        <div className="max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <Link href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
              <Languages className="h-7 w-7 text-primary" />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-foreground">
                LinguaLens
              </span>
            </Link>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-muted-foreground sm:mb-0">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Button
                    variant="link"
                    onClick={() => openModal(link.modal)}
                    className="hover:underline me-4 md:me-6 px-0 text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <hr className="my-6 border-border sm:mx-auto lg:my-8" />
          <span className="block text-sm text-muted-foreground sm:text-center">
            © {currentYear}{" "}
            <Link href="/" className="hover:underline text-foreground hover:text-primary">
              LinguaLens™
            </Link>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
      {activeModal && MODAL_CONTENT[activeModal] && (
        <InfoModal
          isOpen={!!activeModal}
          onClose={closeModal}
          title={MODAL_CONTENT[activeModal].title}
          contentHtml={MODAL_CONTENT[activeModal].content}
        />
      )}
    </>
  );
}
