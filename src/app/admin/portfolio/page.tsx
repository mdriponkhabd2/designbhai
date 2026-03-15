
"use client";

import { useState } from "react";
import { useAdminData, PortfolioItem } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Image as ImageIcon, 
  Search, 
  X, 
  Save 
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function PortfolioPage() {
  const { data, saveData, isLoaded } = useAdminData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    imageUrl: ""
  });

  if (!isLoaded) return null;

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ title: "", category: "", imageUrl: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({ title: item.title, category: item.category, imageUrl: item.imageUrl });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = data.portfolio.filter(item => item.id !== id);
    saveData({ ...data, portfolio: updated });
    toast({ title: "Item deleted", description: "Portfolio item has been removed." });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedPortfolio = [...data.portfolio];

    if (editingItem) {
      updatedPortfolio = updatedPortfolio.map(item => 
        item.id === editingItem.id ? { ...item, ...formData } : item
      );
      toast({ title: "Item updated", description: "Portfolio item has been modified." });
    } else {
      const newItem = {
        id: Date.now().toString(),
        ...formData
      };
      updatedPortfolio.push(newItem);
      toast({ title: "Item added", description: "New portfolio item has been uploaded." });
    }

    saveData({ ...data, portfolio: updatedPortfolio });
    setIsDialogOpen(false);
  };

  const filteredItems = data.portfolio.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground mt-1">Add or edit showcase items on your website.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Add New Item
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card border border-border/60 p-2 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search items by title or category..." 
            className="pl-10 border-none shadow-none focus-visible:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="group overflow-hidden border-border/60 hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-video bg-muted overflow-hidden">
              <Image 
                src={item.imageUrl} 
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Button variant="secondary" size="icon" onClick={() => handleOpenEdit(item)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute top-2 left-2 px-2 py-1 bg-background/90 backdrop-blur-sm rounded-md text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                {item.category}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.category}</p>
            </CardContent>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted text-muted-foreground">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold">No items found</h2>
            <p className="text-muted-foreground">Try a different search or add a new portfolio item.</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add Portfolio Item"}</DialogTitle>
            <DialogDescription>
              Fill in the details for your portfolio showcase.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Project Name" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Logo Design, Branding" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input 
                id="imageUrl" 
                value={formData.imageUrl} 
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..." 
                required 
              />
              <p className="text-[10px] text-muted-foreground">Recommend 3:2 aspect ratio for best display.</p>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="gap-2">
                <Save className="w-4 h-4" />
                {editingItem ? "Update Item" : "Save Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
