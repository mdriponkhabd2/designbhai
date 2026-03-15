
"use client";

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Calendar, Trash2, CheckCircle, Clock, User, Phone, MessageCircle, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OrdersAdminPage() {
  const db = useFirestore();
  
  const ordersQuery = useMemoFirebase(() => {
    return query(collection(db, "orders"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: orders, isLoading } = useCollection(ordersQuery);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "orders", id), { status });
      toast({ title: "Order Updated", description: `Status changed to ${status}.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update order." });
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteDoc(doc(db, "orders", id));
      toast({ title: "Order Deleted", description: "Order has been removed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete order." });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  if (isLoading) return <div className="p-8">Loading orders...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Manage Orders</h1>
        <p className="text-muted-foreground mt-1">View and process customer service orders.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders?.map((order) => (
          <Card key={order.id} className="border-border/60 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(order.status)} variant="outline">
                    {order.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {order.createdAt ? format(order.createdAt.toDate(), "PPpp") : "Just now"}
                  </span>
                </div>
                <CardTitle className="text-2xl font-bold pt-2 flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  {order.fullName}
                </CardTitle>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {order.phoneNumber}</span>
                  <span className="flex items-center gap-1 text-green-600 font-bold"><MessageCircle className="w-3 h-3" /> {order.whatsAppNumber}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteOrder(order.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40">
              <div className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-2xl">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Package Ordered</p>
                  <p className="text-lg font-bold text-primary">{order.packageName}</p>
                  <p className="text-sm font-medium">Price: ৳{order.packagePrice}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-2xl space-y-2">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Payment Information</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className={`font-bold ${order.paymentMethod === 'bKash' ? 'text-pink-600' : 'text-orange-600'}`}>
                      {order.paymentMethod} Payment
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono font-bold text-lg select-all">{order.trxId}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {orders?.length === 0 && (
          <div className="text-center py-32 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border/50">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">No orders yet</h3>
            <p className="text-muted-foreground">Customer orders will appear here for processing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
