
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAdminData } from "@/lib/admin-store";
import { useUser } from "@/firebase";
import { User, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";

export function SiteNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { data, isLoaded } = useAdminData();
  const { user } = useUser();
  const auth = useAuth();

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
    { name: "Products", href: "/products" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-40 transition-all duration-300 px-6 py-4",
      isScrolled || pathname !== "/" ? "bg-background/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold font-headline tracking-tighter">
          Design<span className="text-primary">Bhai</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary font-bold" : "text-foreground/70"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-bold flex items-center gap-2 text-primary">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut(auth)} className="text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
