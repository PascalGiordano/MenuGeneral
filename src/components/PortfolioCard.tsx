import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioCardProps {
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  rating: number;
  category: string; // Category is now an ID string
}

const PortfolioCard = ({ name, description, url, imageUrl, rating, category }: PortfolioCardProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative overflow-hidden rounded-xl bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-xl group-hover:animate-card-hover">
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-primary">{name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
          {category && <p className="mt-1 text-sm text-muted-foreground">Category ID: {category}</p>} {/* Display category ID for now */}
        </div>
      </div>
    </a>
  );
};

export default PortfolioCard;
