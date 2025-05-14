
"use client";

import Link from "next/link";
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
        <div className="max-w-screen-md mx-auto p-2 md:py-4"> {/* Changed padding from p-4 md:py-8 */}
          <div className="flex flex-col items-center sm:flex-row sm:justify-center mb-4 sm:mb-0">
            <ul className="flex flex-wrap items-center justify-center text-sm font-medium text-muted-foreground">
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
          <hr className="my-3 border-border sm:mx-auto lg:my-4" /> {/* Changed margins from my-6 lg:my-8 */}
          <span className="block text-sm text-muted-foreground text-center">
            © {currentYear}. All Rights Reserved.
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

