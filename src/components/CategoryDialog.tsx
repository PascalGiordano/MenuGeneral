import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Category } from '@/types/category';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/services/category";
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const categorySchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters." }),
});

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({ open, onOpenChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
    mode: "onSubmit"
  });

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error loading categories",
        description: "Failed to load categories from database.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (data: z.infer<typeof categorySchema>) => {
    try {
      await addCategory(data);
      loadCategories();
      form.reset();
      toast({
        title: "Category added successfully",
      });
    } catch (error) {
      toast({
        title: "Error adding category",
        description: "Failed to add category.",
        variant: "destructive"
      });
    }
  };

  const handleEditCategory = async (category: Category) => {
    setIsEditing(true);
    setSelectedCategory(category);
    form.setValue("name", category.name);
  };

  const handleUpdateCategory = async (data: z.infer<typeof categorySchema>) => {
    if (!selectedCategory?.id) return;
    try {
      await updateCategory(selectedCategory.id, { name: data.name });
      loadCategories();
      setIsEditing(false);
      setSelectedCategory(null);
      form.reset();
      toast({
        title: "Category updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error updating category",
        description: "Failed to update category.",
        variant: "destructive"
      });
    }
  };


  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      loadCategories();
      toast({
        title: "Category deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting category",
        description: "Failed to delete category.",
        variant: "destructive"
      });
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-kanban h-4 w-4"><path d="M4 19.5a2.5 2.5 0 0 1-2.5-2.5V5a2 2 0 0 1 2-2h4l3 3h7a2 2 0 0 1 2 2v14.5"/><path d="M2 17v-4.5a2.5 2.5 0 0 1 2.5-2.5h16.5a2 2 0 0 1 2 2v5"/><path d="M10 17v-8"/></svg>
          Categories
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Category Management</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-4">
          <Form {...form}>
              <form onSubmit={form.handleSubmit(isEditing ? handleUpdateCategory : handleAddCategory)} className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="primary">{isEditing ? 'Update Category' : 'Add Category'}</Button>
                 {isEditing && (
                  <Button type="button" variant="ghost" onClick={() => { setIsEditing(false); setSelectedCategory(null); form.reset(); }}>Cancel Edit</Button>
                )}
              </form>
            </Form>

            <ul className="mt-4 space-y-2">
              {categories.map(category => (
                <li key={category.id} className="border rounded-md p-2 flex items-center justify-between">
                  <span>{category.name}</span>
                  <div>
                    <Button size="icon" variant="secondary" onClick={() => handleEditCategory(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => category.id && handleDeleteCategory(category.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
