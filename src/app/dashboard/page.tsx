
"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collection, query, where, orderBy } from "firebase/firestore";
import { ShoppingBag, Clock, CheckCircle, XCircle, Package } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UserDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
  }, [user, db]);

  const { data: orders, isLoading } = useCollection(ordersQuery);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
      case "processing": return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Processing</Badge>;
      case "cancelled": return <Badge className="bg-red-100 text-red-700 border-red-200">Cancelled</Badge>;
      default: return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
    }
  };

  if (isUserLoading) return <div className="p-20 text-center">Checking session...</div>;
  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <p>Please login to see your orders.</p>
      <Button asChild><Link href="/login">Go to Login</Link></Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/20">
      <SiteNavbar />
      <main className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-headline font-bold">My Orders</h1>
              <p className="text-muted-foreground mt-2">Track the progress of your purchased services.</p>
            </div>
          </div>

          <div className="grid gap-6">
            {isLoading ? (
              [1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
            ) : orders && orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order.id} className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-primary" />
                          <span className="font-bold text-lg">{order.packageName}</span>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {order.createdAt ? format(order.createdAt.toDate(), "PP") : "Recent"}</span>
                        <span>Price: ৳{order.packagePrice}</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-6 md:w-48 flex items-center justify-center border-l border-border/10">
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Payment Method</p>
                        <p className="font-bold text-sm">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold">No orders found</h3>
                <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                <Button className="mt-6 rounded-xl" asChild><Link href="/services">Browse Services</Link></Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
