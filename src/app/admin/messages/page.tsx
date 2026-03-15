
"use client";

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, Trash2, Eye, EyeOff, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export default function MessagesAdminPage() {
  const db = useFirestore();
  
  const messagesQuery = useMemoFirebase(() => {
    return query(collection(db, "contactMessages"), orderBy("receivedAt", "desc"));
  }, [db]);

  const { data: messages, isLoading } = useCollection(messagesQuery);

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "contactMessages", id), {
        isRead: !currentStatus
      });
      toast({ title: "Status Updated", description: "Message mark as " + (!currentStatus ? "read" : "unread") });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteDoc(doc(db, "contactMessages", id));
      toast({ title: "Deleted", description: "Message has been removed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete message." });
    }
  };

  if (isLoading) return <div className="p-8">Loading messages...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Contact Messages</h1>
        <p className="text-muted-foreground mt-1">View and manage inquiries sent from your website.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {messages?.map((msg) => (
          <Card key={msg.id} className={`border-border/60 transition-all ${!msg.isRead ? "border-l-4 border-l-primary" : ""}`}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="w-5 h-5 text-muted-foreground" />
                  {msg.fullName}
                </CardTitle>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {msg.emailAddress}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> 
                    {msg.receivedAt ? format(msg.receivedAt.toDate(), "PPpp") : "Just now"}
                  </span>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toggleReadStatus(msg.id, msg.isRead)}
                  title={msg.isRead ? "Mark as unread" : "Mark as read"}
                >
                  {msg.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-primary" />}
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMessage(msg.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </div>
              {!msg.isRead && (
                <Badge className="mt-4 bg-primary/10 text-primary border-primary/20" variant="outline">New Message</Badge>
              )}
            </CardContent>
          </Card>
        ))}

        {messages?.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-border/50">
            <Mail className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No messages yet</h3>
            <p className="text-muted-foreground">When someone contacts you, their message will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
