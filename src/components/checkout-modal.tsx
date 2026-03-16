
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
import { ShieldCheck, CreditCard, Send, Zap } from "lucide-react";

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
      trxId: formData.get("trxId")?.toString().toUpperCase(),
      status: "pending",
      createdAt: serverTimestamp(),
      userId: "guest_" + Date.now()
    };

    try {
      await addDoc(collection(db, "orders"), payload);
      toast({
        title: "Order Submitted Successfully!",
        description: "Your order is pending verification. We will contact you on WhatsApp soon.",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "An error occurred while processing your order. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[3rem] border-none shadow-2xl">
        <div className="green-gradient p-12 text-white relative">
          <div className="absolute top-4 right-8 opacity-20"><Zap className="w-16 h-16" /></div>
          <DialogHeader>
            <DialogTitle className="text-4xl font-black uppercase tracking-tighter">Secure Checkout</DialogTitle>
            <DialogDescription className="text-white/90 text-lg font-medium mt-2">
              Package: <span className="font-black text-white">{pkg.name}</span> <br />
              Total Amount: <span className="font-black text-white">৳{pkg.price}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="fullName" className="font-black text-xs uppercase tracking-widest text-slate-500">Step 1: Contact Details</Label>
              <Input id="fullName" name="fullName" placeholder="Your Full Name" required className="rounded-2xl h-14 border-2 focus:ring-primary" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="phoneNumber" placeholder="Phone Number" required className="rounded-2xl h-14 border-2 focus:ring-primary" />
                <Input name="whatsAppNumber" placeholder="WhatsApp Number" required className="rounded-2xl h-14 border-2 focus:ring-primary" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <Label className="text-xs font-black flex items-center gap-2 uppercase tracking-[0.2em] text-primary">
                <CreditCard className="w-5 h-5" />
                Step 2: Payment Method
              </Label>
              <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)} className="flex gap-4">
                <div className={`flex items-center space-x-3 px-6 py-4 rounded-2xl border-2 transition-all cursor-pointer flex-1 ${paymentMethod === 'bKash' ? 'border-pink-500 bg-pink-50 shadow-lg' : 'border-slate-100 bg-white'}`}>
                  <RadioGroupItem value="bKash" id="bKash" className="text-pink-600" />
                  <Label htmlFor="bKash" className="cursor-pointer font-black text-pink-600">bKash</Label>
                </div>
                <div className={`flex items-center space-x-3 px-6 py-4 rounded-2xl border-2 transition-all cursor-pointer flex-1 ${paymentMethod === 'Nagad' ? 'border-orange-500 bg-orange-50 shadow-lg' : 'border-slate-100 bg-white'}`}>
                  <RadioGroupItem value="Nagad" id="Nagad" className="text-orange-600" />
                  <Label htmlFor="Nagad" className="cursor-pointer font-black text-orange-600">Nagad</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-primary/5 p-8 rounded-3xl space-y-4 border border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Send className="w-12 h-12" /></div>
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Step 3: Pay Now</p>
              <div className="space-y-2">
                 <p className="text-sm font-bold text-slate-700">Send <span className="text-primary font-black">৳{pkg.price}</span> via {paymentMethod} "Send Money" to:</p>
                 <p className="text-3xl font-black font-mono tracking-tighter text-slate-900">01837679963</p>
              </div>
              <p className="text-[11px] text-muted-foreground italic font-medium">Please double check the number before sending.</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="trxId" className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Step 4: Transaction ID (TrxID)</Label>
              <Input id="trxId" name="trxId" placeholder="ENTER TrxID HERE" required className="rounded-2xl h-16 font-mono font-black text-2xl uppercase tracking-[0.2em] border-2 border-primary focus:ring-primary text-center" />
            </div>
          </div>

          <DialogFooter className="pt-6 sticky bottom-0 bg-white/95 backdrop-blur-md pb-2">
            <Button type="submit" disabled={isLoading} className="w-full h-16 rounded-2xl font-black text-xl shadow-[0_20px_40px_-15px_rgba(0,200,83,0.3)] gap-4 uppercase tracking-tighter hover:scale-[1.02] transition-all">
              {isLoading ? "PROCESING ORDER..." : "CONFIRM MY ORDER"}
              {!isLoading && <ShieldCheck className="w-6 h-6" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
