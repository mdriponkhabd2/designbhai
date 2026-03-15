
"use client";

import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collection, query, where, orderBy, limit, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  ShoppingBag, 
  Package, 
  MessageCircle, 
  User as UserIcon, 
  Wallet as WalletIcon, 
  CreditCard,
  PlusCircle,
  ShieldCheck,
  Mail,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useAdminData } from "@/lib/admin-store";

export default function UserDashboard() {
  const { user, isUserLoading } = useUser();
  const { data: adminData } = useAdminData();
  const db = useFirestore();
  const [addAmount, setAddAmount] = useState("");
  const [trxId, setTrxId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Optimized query strictly matching security rules
  const ordersQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
  }, [user, db]);

  const walletRef = useMemoFirebase(() => 
    user ? doc(db, "wallets", user.uid) : null, 
    [db, user]
  );

  const walletRequestsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "wallet_requests"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
  }, [user, db]);

  const { data: orders, isLoading: isOrdersLoading } = useCollection(ordersQuery);
  const { data: walletData } = useDoc(walletRef);
  const { data: walletRequests } = useCollection(walletRequestsQuery);

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "wallet_requests"), {
        userId: user.uid,
        amount: Number(addAmount),
        trxId: trxId,
        paymentMethod: "bKash/Nagad",
        status: "pending",
        createdAt: serverTimestamp()
      });
      toast({ title: "Request Sent", description: "Your wallet update request is pending verification." });
      setAddAmount("");
      setTrxId("");
    } catch (error) {
      toast({ variant: "destructive", title: "Failed", description: "Could not send request." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
      case "processing": return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Processing</Badge>;
      case "cancelled": return <Badge className="bg-red-100 text-red-700 border-red-200">Cancelled</Badge>;
      default: return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
    }
  };

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-muted/30">
      <h1 className="text-2xl font-bold">Please login to access your account.</h1>
      <Button asChild className="rounded-xl px-10"><Link href="/login">Login Now</Link></Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/10">
      <SiteNavbar />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 bg-white p-8 rounded-[2.5rem] shadow-sm border border-border/40">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <UserIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome, {user.displayName || 'Customer'}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/50">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <WalletIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Balance</p>
                <p className="text-2xl font-black text-primary">৳{walletData?.balance || 0}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="orders" className="space-y-8">
            <TabsList className="bg-white p-1 rounded-2xl border border-border/40 h-auto flex flex-wrap shadow-sm">
              <TabsTrigger value="orders" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                <ShoppingBag className="w-4 h-4" /> My Orders
              </TabsTrigger>
              <TabsTrigger value="wallet" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                <CreditCard className="w-4 h-4" /> Add Money
              </TabsTrigger>
              <TabsTrigger value="profile" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                <UserIcon className="w-4 h-4" /> My Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-6">
              {isOrdersLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full rounded-2xl" />
                  <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
              ) : orders && orders.length > 0 ? (
                orders.map((order) => (
                  <Card key={order.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                              <Package className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl">{order.packageName}</span>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Date</p>
                            <p className="text-sm font-medium flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" /> 
                              {order.createdAt ? format(order.createdAt.toDate(), "PPpp") : "..."}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Price</p>
                            <p className="text-xl font-bold text-primary">৳{order.packagePrice}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">TrxID</p>
                            <p className="text-sm font-mono font-bold select-all bg-muted/50 px-2 py-0.5 rounded">{order.trxId}</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="rounded-xl gap-2 border-primary/20" asChild>
                        <Link 
                          href={`https://wa.me/${adminData.contact.phones[0]?.replace(/\D/g, '')}?text=Help with Order: ${order.packageName}`}
                          target="_blank"
                        >
                          <MessageCircle className="w-4 h-4 text-[#25D366]" /> Support
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-border/50">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/10 mx-auto mb-4" />
                  <h3 className="text-xl font-bold">No orders found</h3>
                  <Button className="mt-6 rounded-xl" asChild><Link href="/services">Order Now</Link></Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="wallet" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="rounded-[2.5rem] border-none shadow-sm p-8 bg-white">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="w-6 h-6 text-primary" /> Add Funds
                  </CardTitle>
                  <CardDescription>Send money to our bKash/Nagad and provide TrxID below.</CardDescription>
                </CardHeader>
                <form onSubmit={handleAddMoney} className="space-y-6 pt-4">
                  <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 text-sm space-y-2">
                    <p className="font-bold text-primary">Merchant Numbers (Send Money):</p>
                    <p>bKash: <span className="font-mono font-bold">01837679963</span></p>
                    <p>Nagad: <span className="font-mono font-bold">01837679963</span></p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (৳)</Label>
                    <Input id="amount" value={addAmount} onChange={e => setAddAmount(e.target.value)} placeholder="e.g. 500" required className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trxId">Transaction ID (TrxID)</Label>
                    <Input id="trxId" value={trxId} onChange={e => setTrxId(e.target.value)} placeholder="Enter code" required className="rounded-xl h-12 font-mono" />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl font-bold shadow-lg">
                    {isSubmitting ? "Sending..." : "Request Update"}
                  </Button>
                </form>
              </Card>

              <Card className="rounded-[2.5rem] border-none shadow-sm p-8 bg-white">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Recent Requests</CardTitle>
                </CardHeader>
                <div className="space-y-4 pt-4">
                  {walletRequests?.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40">
                      <div>
                        <p className="font-bold">৳{req.amount}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{req.trxId}</p>
                      </div>
                      <Badge variant="outline" className={req.status === 'approved' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200'}>
                        {req.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                  {walletRequests?.length === 0 && <div className="text-center py-10 opacity-40">No requests yet.</div>}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card className="max-w-2xl mx-auto rounded-[2.5rem] border-none shadow-sm p-10 bg-white text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-6">
                  <UserIcon className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold">{user.displayName || 'Customer Account'}</h2>
                <p className="text-muted-foreground mt-2">{user.email}</p>
                <div className="grid grid-cols-2 gap-4 mt-10">
                  <div className="p-6 rounded-3xl bg-muted/30 border border-border/40 text-center">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Status</p>
                    <p className="font-bold flex items-center justify-center gap-2 text-green-600">
                      <ShieldCheck className="w-4 h-4" /> Verified
                    </p>
                  </div>
                  <div className="p-6 rounded-3xl bg-muted/30 border border-border/40 text-center">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Joined</p>
                    <p className="font-bold">{user.metadata.creationTime ? format(new Date(user.metadata.creationTime), "MMM yyyy") : 'N/A'}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
