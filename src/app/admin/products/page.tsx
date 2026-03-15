
"use client";

import { useState } from "react";
import { useAdminData, ProductItem } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2, Edit2, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";

export default function ProductsAdminPage() {
  const { data, saveData, isLoaded } = useAdminData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    imageUrl: "",
    description: ""
  });

  if (!isLoaded) return null;

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({ title: "", price: "", imageUrl: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (product: ProductItem) => {
    setEditingProduct(product);
    setFormData({ title: product.title, price: product.price, imageUrl: product.imageUrl, description: product.description });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure?")) return;
    const updated = data.products.filter(p => p.id !== id);
    saveData({ ...data, products: updated });
    toast({ title: "Product removed" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedProducts = [...data.products];
    if (editingProduct) {
      updatedProducts = updatedProducts.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p);
    } else {
      updatedProducts.push({ id: Date.now().toString(), ...formData });
    }
    saveData({ ...data, products: updatedProducts });
    setIsDialogOpen(false);
    toast({ title: "Products updated" });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your digital products and assets.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.products.map((product) => (
          <Card key={product.id} className="overflow-hidden border-border/60">
            <div className="relative aspect-video bg-muted">
              <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{product.title}</CardTitle>
              <CardDescription>৳{product.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(product)} className="flex-1 gap-2">
                  <Edit2 className="w-3 h-3" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="text-destructive">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>Enter the product details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Price (৳)</Label>
              <Input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
            </div>
            <DialogFooter>
              <Button type="submit" className="gap-2">
                <Save className="w-4 h-4" /> Save Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
