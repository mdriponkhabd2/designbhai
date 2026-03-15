
"use client";

import { useAdminData } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Send, MessageCircle, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

export default function ContactPublicPage() {
  const { data, isLoaded } = useAdminData();

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-1 text-primary">Contact</Badge>
            <h1 className="text-5xl font-headline font-bold">Get In Touch</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Ready to start your next project? Let's talk about how we can help.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="flex gap-4 p-6 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Our Location</h4>
                    <p className="text-sm text-muted-foreground">{data.contact.address}</p>
                  </div>
                </div>
                {data.contact.phones.map((phone, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-2xl bg-muted/50 border border-border/50">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold">Call Us</h4>
                      <p className="text-sm text-muted-foreground">{phone}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 p-6 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email Us</h4>
                    <p className="text-sm text-muted-foreground">hello@designbhai.com</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                  <Link key={i} href="#" className="w-12 h-12 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <Icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>

            <Card className="p-8 rounded-3xl border-border/50 shadow-2xl">
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <Input placeholder="Enter your name" className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email Address</label>
                  <Input type="email" placeholder="email@example.com" className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Message</label>
                  <Textarea placeholder="How can we help?" className="rounded-xl" rows={6} />
                </div>
                <Button className="w-full h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
                  Send Message <Send className="w-4 h-4" />
                </Button>
              </form>
            </Card>
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
