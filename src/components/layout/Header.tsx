
"use client";

import Link from "next/link";
import { Languages, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";
import { InfoModal } from "@/components/common/InfoModal";
import { MODAL_CONTENT, ModalType } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navLinks: { href?: string; label: string; modal?: ModalType }[] = [
  { label: "Home", href: "/" },
  { label: "About", modal: "about" },
  { label: "Features", modal: "features" },
  { label: "Contact", modal: "contact" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const openModal = (modalType: ModalType) => {
    setActiveModal(modalType);
    setIsMobileMenuOpen(false); // Close mobile menu when modal opens
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const renderNavLinks = (isMobile: boolean = false) =>
    navLinks.map((item) => {
      const commonMobileItemClasses = "py-2 px-3 rounded w-full text-foreground hover:bg-muted transition-colors";
      const commonDesktopItemClasses = "py-2 px-3 rounded text-foreground hover:text-primary dark:hover:text-primary transition-colors md:p-0";

      if (item.href) {
        // Link component (e.g., "Home")
        const mobileLinkClasses = cn("flex items-center", commonMobileItemClasses);
        const desktopLinkClasses = cn("block", commonDesktopItemClasses);
        
        return (
          <Link
            key={item.label}
            href={item.href}
            className={isMobile ? mobileLinkClasses : desktopLinkClasses}
            onClick={() => {
              if (isMobile) setIsMobileMenuOpen(false);
            }}
          >
            {item.label}
          </Link>
        );
      } else {
        // Button component (e.g., "About", "Features")
        const mobileButtonClasses = cn("flex items-center justify-start", commonMobileItemClasses);
        // For desktop, rely on variant="ghost" for padding/alignment, just set colors and md:p-0 for text-like appearance
        const desktopButtonClasses = cn("md:p-0 text-foreground hover:text-primary dark:hover:text-primary transition-colors");

        return (
          <Button
            key={item.label}
            variant="ghost"
            onClick={() => {
              if (item.modal) openModal(item.modal);
              if (isMobile) setIsMobileMenuOpen(false);
            }}
            className={isMobile ? mobileButtonClasses : desktopButtonClasses}
          >
            {item.label}
          </Button>
        );
      }
    });

  return (
    <>
      <header className="fixed w-full z-20 top-0 start-0 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <Languages className="h-8 w-8 text-primary" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-foreground">
              LinguaLens
            </span>
          </Link>
          <div className="flex md:order-2 space-x-2 md:space-x-3 rtl:space-x-reverse items-center">
            <ThemeToggle />
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open main menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px] p-6">
                  <nav className="flex flex-col space-y-4 mt-6">
                    {renderNavLinks(true)}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <nav className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-border rounded-lg bg-card md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:items-center md:border-0 md:bg-transparent dark:bg-card-dark md:dark:bg-transparent">
              {renderNavLinks()}
            </ul>
          </nav>
        </div>
      </header>
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
