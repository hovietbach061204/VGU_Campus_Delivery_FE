import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ensureAuthenticated } from './auth';
import { fetchAllEateries } from '@/app/api/eatery';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export async function loadFormattedEateries(): Promise<Restaurant[]> {
  const auth = ensureAuthenticated();
  const token = auth.token;

  const eateries = await fetchAllEateries(token);

  return eateries.map((eatery: any, idx: number) => ({
    id: idx + 1,
    name: eatery.name,
    address: eatery.address,
    contactNumber: eatery.contactNumber,
    dishes: eatery.foodItemMenuResponses || [],
  }));
}
