import { useEffect, useState } from "react";
import PortfolioCard from "@/components/PortfolioCard";
import { Portfolio } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PortfolioForm } from "@/components/PortfolioForm";
import { Plus, Pencil, Trash2, Folder } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  getPortfolios,
  addPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "@/services/portfolio";
import { CategoryDialog } from "@/components/CategoryDialog"; // Import CategoryDialog

const Index = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false); // State for category dialog
  const { toast } = useToast();

  const loadPortfolios = async () => {
    try {
      const data = await getPortfolios();
      setPortfolios(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load portfolios",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadPortfolios();
  }, []);

  const handleAddPortfolio = async (data: Omit<Portfolio, "id">) => {
    try {
      await addPortfolio(data);
      await loadPortfolios();
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Portfolio added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add portfolio",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePortfolio = async (data: Portfolio) => {
    if (!selectedPortfolio?.id) return;
    try {
      await updatePortfolio(selectedPortfolio.id, data);
      await loadPortfolios();
      setIsDialogOpen(false);
      setSelectedPortfolio(null);
      toast({
        title: "Success",
        description: "Portfolio updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update portfolio",
        variant: "destructive",
      });
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    try {
      await deletePortfolio(id);
      await loadPortfolios();
      toast({
        title: "Success",
        description: "Portfolio deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete portfolio",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-background px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center justify-between">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary md:text-5xl">
              Portfolio Showcase
            </h1>
            <p className="mt-4 text-gray-600">
              Discover our collection of innovative applications
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setSelectedPortfolio(null)
                  setIsDialogOpen(true)
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Portfolio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedPortfolio ? "Edit Portfolio" : "Add New Portfolio"}
                </DialogTitle>
              </DialogHeader>
              <PortfolioForm
                onSubmit={selectedPortfolio ? handleUpdatePortfolio : handleAddPortfolio}
                initialData={selectedPortfolio || undefined}
              />
            </DialogContent>
          </Dialog>
        </div>

          <CategoryDialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen} />


        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="group relative animate-fade-in">
              <PortfolioCard {...portfolio} />
              <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => openEditDialog(portfolio)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => portfolio.id && handleDeletePortfolio(portfolio.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
