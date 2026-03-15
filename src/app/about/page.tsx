
"use client";

import { useAdminData } from "@/lib/admin-store";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

export default function AboutPublicPage() {
  const { data, isLoaded } = useAdminData();

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square lg:aspect-auto lg:h-[600px]">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
              {data.about.imageUrl ? (
                <Image 
                  src={data.about.imageUrl} 
                  alt="About DesignBhai" 
                  fill 
                  className="object-cover"
                  unoptimized={data.about.imageUrl.startsWith('https://scontent')}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-8">
            <Badge variant="secondary" className="px-4 py-1 text-primary">Our Story</Badge>
            <h1 className="text-5xl font-headline font-bold leading-tight">Bringing Creativity to Life with Passion</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {data.about.text}
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="space-y-2">
                <h4 className="text-4xl font-bold text-primary">500+</h4>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Projects Completed</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-4xl font-bold text-primary">200+</h4>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Happy Clients</p>
              </div>
            </div>
            <div className="pt-8 border-t border-border">
              <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                {["Professional Expertise", "Timely Delivery", "Unique Creative Concepts", "Affordable Pricing"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />

      <Link 
        href={`https://wa.me/${data.contact.phones[0]?.replace(/\D/g, '')}`}
        target="_blank"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </Link>
    </div>
  );
}
