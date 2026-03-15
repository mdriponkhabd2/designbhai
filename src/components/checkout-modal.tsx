
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { PricingPackage, HostingPackage } from "@/lib/admin-store";
import { ShieldCheck, CreditCard } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: PricingPackage | HostingPackage | null;
}

export function CheckoutModal({ isOpen, onClose, pkg }: CheckoutModalProps) {
  const db = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"bKash" | "Nagad">("bKash");

  if (!pkg) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get("fullName"),
      phoneNumber: formData.get("phoneNumber"),
      whatsAppNumber: formData.get("whatsAppNumber"),
      packageName: pkg.name,
      packagePrice: pkg.price,
      paymentMethod,
      trxId: formData.get("trxId"),
      status: "pending",
      createdAt: serverTimestamp(),
      userId: "guest" // No login required anymore
    };

    try {
      await addDoc(collection(db, "orders"), payload);
      toast({
        title: "Order Placed Successfully!",
        description: "We will verify your transaction shortly.",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-3xl border-none">
        <div className="green-gradient p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Checkout</DialogTitle>
            <DialogDescription className="text-white/80">
              Confirm your order for <span className="font-bold text-white">{pkg.name}</span> (৳{pkg.price})
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" placeholder="Enter your name" required className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Mobile Number</Label>
                <Input id="phoneNumber" name="phoneNumber" placeholder="018XXXXXXXX" required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsAppNumber">WhatsApp Number</Label>
                <Input id="whatsAppNumber" name="whatsAppNumber" placeholder="01XXXXXXXXX" required className="rounded-xl" />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-sm font-bold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Select Payment Method
              </Label>
              <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)} className="flex gap-4">
                <div className="flex items-center space-x-2 bg-pink-50 px-4 py-2 rounded-xl border border-pink-200 cursor-pointer flex-1">
                  <RadioGroupItem value="bKash" id="bKash" />
                  <Label htmlFor="bKash" className="cursor-pointer font-bold text-pink-600">bKash</Label>
                </div>
                <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-xl border border-orange-200 cursor-pointer flex-1">
                  <RadioGroupItem value="Nagad" id="Nagad" />
                  <Label htmlFor="Nagad" className="cursor-pointer font-bold text-orange-600">Nagad</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-muted/50 p-4 rounded-2xl space-y-2 border border-border/50">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Payment Instructions:</p>
              <p className="text-sm">Send <span className="font-bold text-primary">৳{pkg.price}</span> to <span className="font-mono font-bold">01837679963</span> via {paymentMethod} Send Money.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trxId">Transaction ID (TrxID)</Label>
              <Input id="trxId" name="trxId" placeholder="Enter Transaction Code" required className="rounded-xl font-mono uppercase" />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2">
              {isLoading ? "Processing..." : "Confirm & Place Order"}
              {!isLoading && <ShieldCheck className="w-4 h-4" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
