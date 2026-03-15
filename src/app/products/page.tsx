
"use client";

import { useAdminData } from "@/lib/admin-store";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductsPublicPage() {
  const { data, isLoaded } = useAdminData();

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-1 text-primary">Store</Badge>
            <h1 className="text-5xl font-headline font-bold">Our Products</h1>
            <p className="text-muted-foreground">Premium digital assets and design templates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.products.map((product) => (
              <Card key={product.id} className="group overflow-hidden rounded-3xl border-border/50 hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-video overflow-hidden">
                  <Image src={product.imageUrl} alt={product.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between border-t border-border/40 pt-6">
                  <span className="text-2xl font-bold text-primary">৳{product.price}</span>
                  <Button className="gap-2 rounded-xl" asChild>
                    <Link href={`https://wa.me/${data.contact.phones[0]}?text=I'm interested in ${product.title}`}>
                      <ShoppingCart className="w-4 h-4" /> Buy Now
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
