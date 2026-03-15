
"use client";

import { useAdminData } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRight, 
  MessageCircle, 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Palette,
  Layout,
  Layers,
  Monitor,
  ImageIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

export default function LandingPage() {
  const { data, isLoaded } = useAdminData();
  const db = useFirestore();
  const [formLoading, setFormLoading] = useState(false);

  if (!isLoaded) return null;

  const serviceIcons = [Palette, Layout, Layers, Monitor];

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get('fullName'),
      emailAddress: formData.get('email'),
      message: formData.get('message'),
      receivedAt: serverTimestamp(),
      isRead: false
    };

    try {
      await addDoc(collection(db, 'contactMessages'), payload);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We will get back to you soon.",
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again later.",
      });
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid-slate-100/[0.03] bg-[bottom_left] -z-10" />
      <SiteNavbar />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 green-gradient opacity-10 -z-10" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <Badge variant="outline" className="px-4 py-1 border-primary/20 text-primary font-bold uppercase tracking-widest text-[10px]">
              Graphics Design Agency
            </Badge>
            <h1 className="text-6xl md:text-7xl font-headline font-bold leading-[1.1] tracking-tight">
              Design<span className="text-primary">Bhai</span> <br />
              <span className="text-muted-foreground">Creative Solutions</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              We transform your ideas into stunning visual realities. From logos to complete branding, we build identities that resonate.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="px-8 gap-2 rounded-full shadow-lg shadow-primary/20" asChild>
                <Link href="/portfolio">
                  View Portfolio <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 rounded-full border-primary/20 hover:bg-primary/5" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-square lg:aspect-auto lg:h-[600px] animate-in fade-in zoom-in-95 duration-1000">
            <div className="absolute inset-0 green-gradient rounded-[2rem] rotate-3 opacity-20 blur-2xl" />
            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl">
              {data.settings.heroImageUrl ? (
                <Image 
                  src={data.settings.heroImageUrl} 
                  alt="Creative Design" 
                  fill 
                  className="object-cover"
                  priority
                  unoptimized={data.settings.heroImageUrl.startsWith('https://scontent')}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-muted-foreground/20" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-headline font-bold">Expert Services</h2>
            <p className="text-muted-foreground">Comprehensive design solutions tailored to your business needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.services.map((service, idx) => {
              const Icon = serviceIcons[idx % serviceIcons.length];
              return (
                <Card key={service.id} className="p-8 rounded-3xl border-border/50 hover:border-primary/30 transition-colors shadow-sm text-center space-y-6">
                  <div className="w-16 h-16 green-gradient rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-primary/20">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
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
          <div className="space-y-8">
            <Badge variant="secondary" className="px-4 py-1 text-primary">Our Story</Badge>
            <h2 className="text-4xl font-headline font-bold">Bringing Creativity to Life</h2>
            <p className="text-lg text-muted-foreground leading-relaxed italic">
              "{data.about.text}"
            </p>
            <Button size="lg" className="rounded-full gap-2" asChild>
              <Link href="/about">Learn More About Us <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div className="space-y-4">
                <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20">Contact Us</Badge>
                <h2 className="text-4xl font-headline font-bold">Let's Work Together</h2>
                <p className="text-muted-foreground">Have a vision? We have the tools. Send us a message and let's create something amazing.</p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 p-5 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Location</h4>
                    <p className="text-sm text-muted-foreground">{data.contact.address}</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Phone</h4>
                    <p className="text-sm text-muted-foreground">{data.contact.phones[0]}</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p className="text-sm text-muted-foreground">{data.contact.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 rounded-3xl border-border/50 shadow-xl">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <Input name="fullName" placeholder="Enter your name" className="rounded-xl h-12" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email Address</label>
                  <Input name="email" type="email" placeholder="email@example.com" className="rounded-xl h-12" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Message</label>
                  <Textarea name="message" placeholder="How can we help?" className="rounded-xl" rows={6} required />
                </div>
                <Button type="submit" disabled={formLoading} className="w-full h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
                  {formLoading ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <SiteFooter />

      <Link 
        href={`https://wa.me/${data.contact.phones[0]?.replace(/\D/g, '')}`}
        target="_blank"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-bounce hover:animate-none"
      >
        <MessageCircle className="w-6 h-6" />
      </Link>
    </div>
  );
}
