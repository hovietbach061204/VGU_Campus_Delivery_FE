import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ensureAuthenticated } from './auth';
import { fetchAllEateries } from '@/app/api/eatery';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// Local Restaurant type for utils
export interface Restaurant {
  id: number;
  name: string;
  location: string;
  contactNumber: string;
  dishes: Array<{
    id: number;
    name: string;
    price: number;
    description: string;
  }>;
}

export async function loadFormattedEateries(): Promise<Restaurant[]> {
  const auth = ensureAuthenticated();
  const token = auth.token;

  const eateries = await fetchAllEateries(token);

  return eateries.map((eatery: any, idx: number) => ({
    id: idx + 1,
    name: eatery.name,
    location: eatery.location, // Changed from address to location
    contactNumber: eatery.contactNumber,
    dishes: (eatery.foodItemMenuResponses || []).map(
      (dish: any, dishIdx: number) => ({
        id: dish.id !== undefined ? dish.id : dishIdx + 1,
        name: dish.name,
        price: dish.price,
        description: dish.description,
      })
    ),
  }));
}
