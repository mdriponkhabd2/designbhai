
"use client";

import { useState } from "react";
import { useAdminData, ServiceItem } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2, Save, GripVertical } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ServicesPage() {
  const { data, saveData, isLoaded } = useAdminData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isLoaded) return null;

  const handleStartEdit = (service: ServiceItem) => {
    setEditingId(service.id);
    setFormData({ title: service.title, description: service.description });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = data.services.filter(s => s.id !== id);
    saveData({ ...data, services: updated });
    toast({ title: "Service removed", description: "The service has been deleted from the website." });
  };

  const handleSave = (id?: string) => {
    let updatedServices = [...data.services];

    if (id) {
      updatedServices = updatedServices.map(s => s.id === id ? { ...s, ...formData } : s);
      toast({ title: "Service updated", description: "Changes have been saved." });
    } else {
      updatedServices.push({ id: Date.now().toString(), ...formData });
      toast({ title: "Service added", description: "New service is now visible on the website." });
    }

    saveData({ ...data, services: updatedServices });
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ title: "", description: "" });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Services Management</h1>
          <p className="text-muted-foreground mt-1">Manage the specific design services you offer.</p>
        </div>
        {!showAddForm && (
          <Button onClick={() => { setShowAddForm(true); setFormData({ title: "", description: "" }); }} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {showAddForm && (
          <Card className="border-primary/30 bg-primary/5 shadow-sm animate-in fade-in slide-in-from-top-4">
            <CardHeader>
              <CardTitle className="text-lg">Add New Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-title">Service Title</Label>
                <Input 
                  id="new-title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. UI/UX Design"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-desc">Description</Label>
                <Textarea 
                  id="new-desc" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed explanation of what you provide..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                <Button onClick={() => handleSave()} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Service
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {data.services.map((service) => (
          <Card key={service.id} className="border-border/60 hover:border-primary/20 transition-colors">
            <CardContent className="p-0">
              {editingId === service.id ? (
                <div className="p-6 space-y-4 bg-muted/20">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-title-${service.id}`}>Title</Label>
                    <Input 
                      id={`edit-title-${service.id}`}
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`edit-desc-${service.id}`}>Description</Label>
                    <Textarea 
                      id={`edit-desc-${service.id}`}
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                    <Button onClick={() => handleSave(service.id)} className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4 p-6">
                  <div className="mt-1">
                    <GripVertical className="w-5 h-5 text-muted-foreground/30" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                    <p className="text-muted-foreground mt-2 leading-relaxed">{service.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/5" onClick={() => handleStartEdit(service)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive hover:bg-destructive/5" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
