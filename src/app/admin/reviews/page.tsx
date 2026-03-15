
"use client";

import { useState, useEffect } from "react";
import { useAdminData, Testimonial } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ReviewsAdminPage() {
  const { data, saveData, isLoaded } = useAdminData();
  const [reviews, setReviews] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (isLoaded) {
      setReviews(data.testimonials || []);
    }
  }, [isLoaded, data]);

  if (!isLoaded) return null;

  const handleReviewChange = (id: string, field: keyof Testimonial, value: any) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addReview = () => {
    const newReview: Testimonial = {
      id: Date.now().toString(),
      name: "New Customer",
      role: "Client",
      text: "Enter review text here...",
      rating: 5
    };
    setReviews([...reviews, newReview]);
  };

  const removeReview = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  const handleSave = () => {
    saveData({ ...data, testimonials: reviews });
    toast({ title: "Reviews updated", description: "Customer testimonials have been saved." });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">Customer Reviews</h1>
          <p className="text-muted-foreground mt-1">Manage testimonials shown on the home page carousel.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={addReview} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Review
          </Button>
          <Button onClick={handleSave} className="gap-2 shadow-lg">
            <Save className="w-4 h-4" />
            Save All Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <Card key={review.id} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                Customer Feedback
              </CardTitle>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeReview(review.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input 
                    value={review.name} 
                    onChange={e => handleReviewChange(review.id, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role/Company</Label>
                  <Input 
                    value={review.role} 
                    onChange={e => handleReviewChange(review.id, 'role', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Rating (1-5)</Label>
                <Input 
                  type="number"
                  min="1"
                  max="5"
                  value={review.rating} 
                  onChange={e => handleReviewChange(review.id, 'rating', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Review Text</Label>
                <Textarea 
                  value={review.text} 
                  onChange={e => handleReviewChange(review.id, 'text', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-border/50">
          <Star className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No reviews yet</h3>
          <p className="text-muted-foreground">Click "Add Review" to create your first customer testimonial.</p>
        </div>
      )}
    </div>
  );
}
