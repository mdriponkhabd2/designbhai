
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

export interface HostingPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  orderLink: string;
  isPopular?: boolean;
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

const STORAGE_KEY = 'designbhai_admin_data_v7';

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
      name: 'Basic Package', 
      price: '6,000', 
      description: 'Monthly Social Media Retainer.', 
      features: [
        '10 Social Media Post Designs',
        '2 Banner Designs',
        'Delivery Time: 3–5 Days',
        '1 Revision',
        'Basic Support'
      ],
      orderLink: '#'
    },
    { 
      id: 'p2', 
      name: 'Standard Package', 
      price: '12,000', 
      description: 'Ideal for growing brands.', 
      features: [
        '20 Social Media Post Designs',
        '5 Banner Designs',
        '5 Story Designs',
        'Delivery Time: 2–3 Days',
        '3 Revisions',
        'Priority Support'
      ],
      orderLink: '#',
      isPopular: true
    },
    { 
      id: 'p3', 
      name: 'Premium Package', 
      price: '20,000', 
      description: 'Best for high-volume content.', 
      features: [
        '40 Social Media Post Designs',
        '10 Banner Designs',
        '10 Story Designs',
        'Custom Design Requests',
        'Unlimited Revisions',
        'Priority Delivery'
      ],
      orderLink: '#'
    }
  ],
  hostingPackages: [
    {
      id: 'h1',
      name: 'Starter Hosting',
      price: '199',
      description: 'Fast, Secure and Affordable Domain Hosting for Everyone',
      features: ['1 Website', '5GB SSD Storage', 'Free SSL Certificate', 'Free .com Domain (SOHO Domain Offer)', '5 Email Accounts', 'cPanel Access', '24/7 Support'],
      orderLink: '#'
    },
    {
      id: 'h2',
      name: 'Business Hosting',
      price: '399',
      description: 'Ideal for growing businesses that need a professional online presence.',
      features: ['5 Websites', '15GB SSD Storage', 'Free SSL Certificate', 'Free .com Domain (SOHO Domain Offer)', 'Unlimited Email Accounts', 'cPanel Access', 'Weekly Backup', '24/7 Priority Support'],
      orderLink: '#',
      isPopular: true
    },
    {
      id: 'h3',
      name: 'Pro Hosting',
      price: '699',
      description: 'Best for brands who want a high-quality and optimized website.',
      features: ['Unlimited Websites', '50GB SSD Storage', 'Free SSL Certificate', 'Free .com Domain (SOHO Domain Offer)', 'Unlimited Email Accounts', 'cPanel Access', 'Daily Backup', 'LiteSpeed Speed Optimization', '24/7 Premium Support'],
      orderLink: '#'
    }
  ],
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
          hostingPackages: parsed.hostingPackages || DEFAULT_DATA.hostingPackages,
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
