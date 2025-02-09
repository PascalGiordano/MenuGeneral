export interface Portfolio {
  id?: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  rating: number;
  category: string; // Added category field
  createdAt?: Date;
  updatedAt?: Date;
}
