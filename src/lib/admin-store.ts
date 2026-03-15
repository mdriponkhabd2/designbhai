
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

export interface AboutData {
  text: string;
  imageUrl: string;
}

export interface ContactData {
  address: string;
  phones: string[];
}

export interface WebsiteSettings {
  title: string;
  favicon: string;
}

const STORAGE_KEY = 'designbhai_admin_data';

const DEFAULT_DATA = {
  portfolio: [
    { id: '1', title: 'Brand Identity', category: 'Branding', imageUrl: 'https://picsum.photos/seed/design1/600/400' },
    { id: '2', title: 'Coffee Shop Logo', category: 'Logo', imageUrl: 'https://picsum.photos/seed/design2/600/400' },
    { id: '3', title: 'Fitness App', category: 'UI/UX', imageUrl: 'https://picsum.photos/seed/design3/600/400' },
  ],
  services: [
    { id: '1', title: 'Logo Design', description: 'Unique and memorable logos for your brand.' },
    { id: '2', title: 'Web Design', description: 'Modern and responsive websites.' },
    { id: '3', title: 'Social Media', description: 'Engaging graphics for your social presence.' },
  ],
  about: {
    text: 'DesignBhai is a premier graphics design studio dedicated to bringing your creative visions to life. With years of experience and a passion for aesthetic excellence, we serve clients globally from our studio in Bangladesh.',
    imageUrl: 'https://picsum.photos/seed/studio/800/600'
  },
  contact: {
    address: 'Sadaynagaor, Austagram, Kishoregonj',
    phones: ['01837679963', '01977679962']
  },
  settings: {
    title: 'DesignBhai | Creative Studio',
    favicon: '/favicon.ico'
  }
};

export function useAdminData() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveData = (newData: typeof DEFAULT_DATA) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  return { data, saveData, isLoaded };
}
