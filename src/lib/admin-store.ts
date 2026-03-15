
"use client";

import { useFirestore, useDoc } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useMemo } from 'react';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  orderLink: string;
  isPopular?: boolean;
  category?: 'design' | 'website';
}

export interface HostingPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  orderLink: string;
  isPopular?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface ProductItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  description: string;
}

export interface AboutData {
  text: string;
  imageUrl: string;
  team: TeamMember[];
}

export interface ContactData {
  address: string;
  phones: string[];
  email: string;
}

export interface WebsiteSettings {
  title: string;
  favicon: string;
  heroImageUrl: string;
  stats: {
    completed: string;
    happyClients: string;
    pending: string;
  };
}

const DEFAULT_DATA = {
  portfolio: [
    { id: '1', title: 'Brand Identity', category: 'Branding', imageUrl: 'https://picsum.photos/seed/design1/600/400' },
    { id: '2', title: 'Minimalist Coffee Logo', category: 'Logo Design', imageUrl: 'https://picsum.photos/seed/design2/600/400' },
    { id: '3', title: 'Fitness App UI', category: 'UI/UX', imageUrl: 'https://picsum.photos/seed/design3/600/400' },
  ],
  services: [
    { id: '1', title: 'Logo Design', description: 'Crafting unique and memorable visual identities.' },
    { id: '2', title: 'Web Design', description: 'Modern, responsive, and user-centric websites.' },
  ],
  products: [
    { id: 'p1', title: 'Premium Logo Template', price: '500', imageUrl: 'https://picsum.photos/seed/prod1/400/300', description: 'Fully editable vector logo.' },
    { id: 'p2', title: 'Landing Page UI Kit', price: '1200', imageUrl: 'https://picsum.photos/seed/prod2/400/300', description: 'Modern UI elements for web.' },
  ],
  packages: [
    { 
      id: 'd1', 
      name: 'Basic Package', 
      price: '6,000', 
      category: 'design',
      description: 'Perfect for small social media presence.',
      features: ['10 Social Media Post Designs', '2 Banner Designs', 'Delivery Time: 3–5 Days', '1 Revision'],
      orderLink: '#'
    },
    { 
      id: 'w1', 
      name: '🟢 Starter Package', 
      price: '2,999', 
      category: 'website',
      description: 'Perfect for beginners.', 
      features: ['1 Professional Landing Page', '1 Website Setup', '5GB Monthly Hosting', 'Free Domain (.com / .shop)', 'Mobile Responsive Design', 'Basic Support'],
      orderLink: '#'
    }
  ],
  hostingPackages: [
    {
      id: 'h1',
      name: 'Starter Hosting',
      price: '199',
      description: 'Fast, Secure and Affordable Domain Hosting for Everyone',
      features: ['1 Website', '5GB SSD Storage', 'Free SSL Certificate', 'Free .com Domain', '5 Email Accounts', 'cPanel Access', '24/7 Support'],
      orderLink: '#'
    },
    {
      id: 'h2',
      name: 'Business Hosting',
      price: '399',
      description: 'Ideal for growing businesses.',
      isPopular: true,
      features: ['5 Websites', '15GB SSD Storage', 'Free SSL Certificate', 'Free .com Domain', 'Unlimited Email Accounts', 'cPanel Access', 'Weekly Backup', '24/7 Priority Support'],
      orderLink: '#'
    }
  ],
  testimonials: [
    { id: 'r1', name: 'Karim Ullah', role: 'Client', text: 'Great service! Highly recommended.', rating: 5 },
  ],
  about: {
    text: 'DesignBhai is a premier graphics design studio dedicated to bringing your creative visions to life. With years of experience and a passion for aesthetic excellence, we serve clients globally from our studio in Bangladesh.',
    imageUrl: 'https://picsum.photos/seed/studio/800/600',
    team: [
      { id: 't1', name: 'Ripon Kha', designation: 'Graphics Designer', imageUrl: 'https://picsum.photos/seed/team1/400/400' },
      { id: 't2', name: 'Member Two', designation: 'Web Designer', imageUrl: 'https://picsum.photos/seed/team2/400/400' },
      { id: 't3', name: 'Member Three', designation: 'Digital Marketing', imageUrl: 'https://picsum.photos/seed/team3/400/400' },
    ]
  },
  contact: {
    address: 'Sadaynagaor, Austagram, Kishoregonj',
    phones: ['01837679963'],
    email: 'mdriponkha2@gmail.com'
  },
  settings: {
    title: 'DesignBhai | Creative Studio',
    favicon: '/favicon.ico',
    heroImageUrl: 'https://picsum.photos/seed/design-hero/800/1000',
    stats: {
      completed: '500+',
      happyClients: '200+',
      pending: '15'
    }
  }
};

export function useAdminData() {
  const db = useFirestore();
  // Using a memoized document reference for real-time sync across all users
  const configRef = useMemo(() => {
    const ref = doc(db, "website_config", "main");
    (ref as any).__memo = true;
    return ref;
  }, [db]);

  const { data: firestoreData, isLoading } = useDoc(configRef);

  const data = useMemo(() => {
    if (!firestoreData) return DEFAULT_DATA;
    return {
      ...DEFAULT_DATA,
      ...firestoreData,
      // Ensure nested objects are merged correctly
      settings: { ...DEFAULT_DATA.settings, ...(firestoreData.settings || {}) },
      about: { ...DEFAULT_DATA.about, ...(firestoreData.about || {}) },
      contact: { ...DEFAULT_DATA.contact, ...(firestoreData.contact || {}) },
    };
  }, [firestoreData]);

  const saveData = (newData: typeof DEFAULT_DATA) => {
    // Save to Firestore so all users see the updates immediately
    setDoc(doc(db, "website_config", "main"), newData);
  };

  return { data, saveData, isLoaded: !isLoading };
}
