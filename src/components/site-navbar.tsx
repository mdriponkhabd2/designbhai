
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdminData } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export function SiteNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { data, isLoaded } = useAdminData();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isLoaded) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Store", href: "/products" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-40 transition-all duration-500 px-6 py-4",
      isScrolled || pathname !== "/" ? "bg-background/90 backdrop-blur-xl shadow-md py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-black font-headline tracking-tighter uppercase shrink-0">
          Design<span className="text-primary">Bhai</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={cn(
                "text-sm font-bold transition-all hover:text-primary tracking-tight",
                pathname === link.href ? "text-primary border-b-2 border-primary" : "text-foreground/70"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="rounded-full px-6 font-bold shadow-lg shadow-primary/20">
            <Link href="/services" className="gap-2">
              <ShoppingBag className="w-4 h-4" /> Order Now
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
