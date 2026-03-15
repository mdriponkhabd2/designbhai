
"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAdminData } from "@/lib/admin-store";

export function SiteFooter() {
  const { data, isLoaded } = useAdminData();

  if (!isLoaded) return null;

  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-headline tracking-tighter">
            Design<span className="text-primary">Bhai</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Premium graphics design studio specializing in logo design, branding, and digital assets.
          </p>
          <div className="text-xs text-slate-500">
            <p>{data.contact.address}</p>
            <p className="mt-1">{data.contact.email}</p>
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-lg font-bold">Quick Links</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="text-lg font-bold">Services</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            {data.services.slice(0, 4).map(s => (
              <li key={s.id}><span className="hover:text-primary cursor-default">{s.title}</span></li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="text-lg font-bold">Newsletter</h4>
          <p className="text-slate-400 text-sm">Stay updated with our latest works.</p>
          <div className="flex gap-2">
            <Input className="bg-white/5 border-white/10 text-white rounded-lg h-11" placeholder="Email" />
            <Button size="icon" className="shrink-0 rounded-lg">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 text-xs">
          &copy; {new Date().getFullYear()} DesignBhai Creative Studio. All rights reserved.
        </p>
        <div className="flex gap-8 text-xs text-slate-500">
          <Link href="#" className="hover:text-white">Privacy Policy</Link>
          <Link href="#" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
