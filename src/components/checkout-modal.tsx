
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { PricingPackage, HostingPackage } from "@/lib/admin-store";
import { ShieldCheck, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: PricingPackage | HostingPackage | null;
}

export function CheckoutModal({ isOpen, onClose, pkg }: CheckoutModalProps) {
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
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
      userId: user ? user.uid : "guest" // Associate with logged-in user if available
    };

    try {
      await addDoc(collection(db, "orders"), payload);
      toast({
        title: "Order Placed Successfully!",
        description: "We will verify your transaction shortly.",
      });
      onClose();
      if (user) {
        router.push("/dashboard");
      }
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
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
        <div className="green-gradient p-10 text-white relative">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase tracking-tighter">Secure Checkout</DialogTitle>
            <DialogDescription className="text-white/90 text-lg">
              Ordering <span className="font-black text-white">{pkg.name}</span> for ৳{pkg.price}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="font-bold">Full Name</Label>
              <Input id="fullName" name="fullName" defaultValue={user?.displayName || ""} placeholder="Ripon Kha" required className="rounded-xl h-12" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="font-bold">Contact Number</Label>
                <Input id="phoneNumber" name="phoneNumber" placeholder="018XXXXXXXX" required className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsAppNumber" className="font-bold">WhatsApp Number</Label>
                <Input id="whatsAppNumber" name="whatsAppNumber" placeholder="01XXXXXXXXX" required className="rounded-xl h-12" />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/50">
              <Label className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-primary">
                <CreditCard className="w-5 h-5" />
                Step 1: Select Payment Method
              </Label>
              <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)} className="flex gap-4">
                <div className={`flex items-center space-x-2 px-4 py-3 rounded-2xl border-2 transition-all cursor-pointer flex-1 ${paymentMethod === 'bKash' ? 'border-pink-500 bg-pink-50 shadow-md' : 'border-border bg-white'}`}>
                  <RadioGroupItem value="bKash" id="bKash" className="text-pink-600" />
                  <Label htmlFor="bKash" className="cursor-pointer font-black text-pink-600">bKash</Label>
                </div>
                <div className={`flex items-center space-x-2 px-4 py-3 rounded-2xl border-2 transition-all cursor-pointer flex-1 ${paymentMethod === 'Nagad' ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-border bg-white'}`}>
                  <RadioGroupItem value="Nagad" id="Nagad" className="text-orange-600" />
                  <Label htmlFor="Nagad" className="cursor-pointer font-black text-orange-600">Nagad</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-primary/5 p-5 rounded-2xl space-y-3 border border-primary/20">
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Step 2: Payment Instructions</p>
              <div className="space-y-1">
                 <p className="text-sm font-bold">Please Send Money <span className="text-primary">৳{pkg.price}</span> to:</p>
                 <p className="text-2xl font-black font-mono tracking-tighter">01837679963</p>
              </div>
              <p className="text-[11px] text-muted-foreground italic">Use {paymentMethod} "Send Money" option only.</p>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="trxId" className="font-black text-xs uppercase tracking-widest">Step 3: Enter Transaction ID (TrxID)</Label>
              <Input id="trxId" name="trxId" placeholder="AX72K93P..." required className="rounded-xl h-14 font-mono font-bold text-lg uppercase tracking-widest border-2 focus:border-primary" />
            </div>
          </div>

          <DialogFooter className="pt-4 sticky bottom-0 bg-white">
            <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 gap-3 uppercase tracking-tighter">
              {isLoading ? "Processing Order..." : "Confirm My Order"}
              {!isLoading && <ShieldCheck className="w-5 h-5" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
