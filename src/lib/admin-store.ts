
"use client";

import { useState, useEffect } from 'react';

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
}

export interface HostingOption {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  orderLink: string;
}

export interface AboutData {
  text: string;
  imageUrl: string;
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
}

const STORAGE_KEY = 'designbhai_admin_data_v4';

const DEFAULT_DATA = {
  portfolio: [
    { id: '1', title: 'Brand Identity', category: 'Branding', imageUrl: 'https://picsum.photos/seed/design1/600/400' },
    { id: '2', title: 'Minimalist Coffee Logo', category: 'Logo Design', imageUrl: 'https://picsum.photos/seed/design2/600/400' },
    { id: '3', title: 'Fitness App UI', category: 'UI/UX', imageUrl: 'https://picsum.photos/seed/design3/600/400' },
    { id: '4', title: 'Social Media Ad Pack', category: 'Social Media', imageUrl: 'https://picsum.photos/seed/design4/600/400' },
    { id: '5', title: 'Modern Business Card', category: 'Branding', imageUrl: 'https://picsum.photos/seed/design5/600/400' },
    { id: '6', title: 'Corporate Brochure', category: 'Branding', imageUrl: 'https://picsum.photos/seed/design6/600/400' },
  ],
  services: [
    { id: '1', title: 'Logo Design', description: 'Crafting unique and memorable visual identities that stand out in any industry.' },
    { id: '2', title: 'Web Design', description: 'Modern, responsive, and user-centric websites that turn visitors into loyal customers.' },
    { id: '3', title: 'Social Media', description: 'Engaging content and graphic assets to boost your social presence and growth.' },
    { id: '4', title: 'Branding', description: 'Complete brand strategies including typography, colors, and design guidelines.' },
  ],
  packages: [
    { 
      id: 'p1', 
      name: '🟢 Starter Package', 
      price: '2,999', 
      description: 'Perfect for individuals and small businesses starting online.', 
      features: [
        '1 Professional Landing Page', 
        '1 Website Setup', 
        '5GB Monthly Hosting', 
        'Free Domain (.com / .shop)', 
        'Mobile Responsive Design', 
        'Basic Support', 
        '🚀 Best for beginners.'
      ],
      orderLink: '#'
    },
    { 
      id: 'p2', 
      name: '🔵 Business Package', 
      price: '5,999', 
      description: 'Ideal for growing businesses that need a professional online presence.', 
      features: [
        'Premium Landing Page Design', 
        '1 Complete Website', 
        '5GB Fast Hosting (Monthly)', 
        'Free Domain (.com / .shop)', 
        'Fully Mobile Responsive', 
        'SEO Friendly Setup', 
        'Priority Support', 
        '⭐ Perfect for business owners.'
      ],
      orderLink: '#',
      isPopular: true
    },
    { 
      id: 'p3', 
      name: '🟣 Premium Package', 
      price: '9,999', 
      description: 'Best for brands who want a high-quality and optimized website.', 
      features: [
        'High Converting Landing Page', 
        'Professional Business Website', 
        '5GB High Speed Hosting (Monthly)', 
        'Free Domain (.com / .shop)', 
        'Advanced UI Design', 
        'SEO Optimization', 
        'Premium Support', 
        '🔥 Complete solution for serious businesses.'
      ],
      orderLink: '#'
    }
  ],
  hosting: {
    id: 'h1',
    name: 'Business Hosting',
    price: '2,000 /yr',
    description: 'Ultra-fast and secure hosting for your creative website.',
    features: ['10GB SSD Storage', 'Free SSL Certificate', 'Daily Backups', '24/7 Support', 'Free Domain (.com)'],
    orderLink: '#'
  },
  about: {
    text: 'DesignBhai is a premier graphics design studio dedicated to bringing your creative visions to life. With years of experience and a passion for aesthetic excellence, we serve clients globally from our studio in Bangladesh. We believe every pixel tells a story, and we are here to help you tell yours effectively.',
    imageUrl: 'https://picsum.photos/seed/studio/800/600'
  },
  contact: {
    address: 'Sadaynagaor, Austagram, Kishoregonj',
    phones: ['01837679963', '01977679962'],
    email: 'mdriponkha2@gmail.com'
  },
  settings: {
    title: 'DesignBhai | Creative Studio',
    favicon: '/favicon.ico',
    heroImageUrl: 'https://picsum.photos/seed/design-hero/800/1000'
  }
};

export function useAdminData() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData({
          ...DEFAULT_DATA,
          ...parsed,
          contact: {
            ...DEFAULT_DATA.contact,
            ...(parsed.contact || {})
          },
          settings: {
            ...DEFAULT_DATA.settings,
            ...(parsed.settings || {})
          },
          packages: parsed.packages || DEFAULT_DATA.packages,
          hosting: parsed.hosting || DEFAULT_DATA.hosting
        });
      } catch (e) {
        console.error("Failed to parse stored data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveData = (newData: typeof DEFAULT_DATA) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    window.dispatchEvent(new Event('storage'));
  };

  return { data, saveData, isLoaded };
}
