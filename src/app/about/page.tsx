
"use client";

import { useAdminData } from "@/lib/admin-store";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, MessageCircle, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPublicPage() {
  const { data, isLoaded } = useAdminData();

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      
      <main className="pt-32 pb-24">
        {/* Story Section */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative aspect-square lg:aspect-auto lg:h-[600px]">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
              {data.about.imageUrl ? (
                <Image 
                  src={data.about.imageUrl} 
                  alt="About DesignBhai" 
                  fill 
                  className="object-cover"
                  unoptimized={data.about.imageUrl.startsWith('https://')}
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

        {/* Team Section */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20">Our Team</Badge>
            <h2 className="text-4xl font-headline font-bold">Meet Our Creative Experts</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The talented individuals behind DesignBhai's success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.about.team?.map((member) => (
              <Card key={member.id} className="group overflow-hidden rounded-[2rem] border-border/50 hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {member.imageUrl ? (
                      <Image 
                        src={member.imageUrl} 
                        alt={member.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        unoptimized={member.imageUrl.startsWith('https://')}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                      <div className="flex gap-4">
                        <Link href="#" className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors">
                          <Instagram className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors">
                          <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors">
                          <Linkedin className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 text-center bg-white">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{member.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium mt-1 uppercase tracking-wider">{member.designation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
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
