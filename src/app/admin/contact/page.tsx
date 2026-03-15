
"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, MapPin, Phone, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { data, saveData, isLoaded } = useAdminData();
  const [address, setAddress] = useState("");
  const [phones, setPhones] = useState<string[]>([]);

  useEffect(() => {
    if (isLoaded) {
      setAddress(data.contact.address);
      setPhones([...data.contact.phones]);
    }
  }, [isLoaded, data]);

  if (!isLoaded) return null;

  const handlePhoneChange = (index: number, value: string) => {
    const updated = [...phones];
    updated[index] = value;
    setPhones(updated);
  };

  const addPhone = () => {
    setPhones([...phones, ""]);
  };

  const removePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    saveData({ ...data, contact: { address, phones: phones.filter(p => p.trim() !== "") } });
    toast({ title: "Contact info updated", description: "Phone numbers and address have been saved." });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Contact Management</h1>
        <p className="text-muted-foreground mt-1">Update your studio location and phone numbers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Office Address
            </CardTitle>
            <CardDescription>Primary physical location for clients to visit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input 
                id="address" 
                value={address} 
                onChange={e => setAddress(e.target.value)}
                placeholder="Village, District, Region..."
              />
            </div>
            <div className="pt-4 border-t border-border/40">
              <h4 className="text-sm font-semibold mb-2">Display Preview:</h4>
              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md italic">
                {address || "No address set."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Phone Numbers
            </CardTitle>
            <CardDescription>Active contact lines for customer support.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {phones.map((phone, idx) => (
              <div key={idx} className="flex gap-2">
                <Input 
                  value={phone} 
                  onChange={e => handlePhoneChange(idx, e.target.value)}
                  placeholder="e.g. 018XXXXXXXX"
                />
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removePhone(idx)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full gap-2 border-dashed" onClick={addPhone}>
              <Plus className="w-4 h-4" />
              Add Phone Number
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button size="lg" className="px-12 gap-2" onClick={handleSave}>
          <Save className="w-4 h-4" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
