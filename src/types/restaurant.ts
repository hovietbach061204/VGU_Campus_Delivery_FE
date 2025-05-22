interface Dish {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface Restaurant {
  id: number;
  name: string;
  address: string;
  contactNumber: string;
  dishes: Dish[];
}
