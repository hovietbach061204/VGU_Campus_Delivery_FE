// src/env.mjs

export const API_URL = process.env.API_URL || 'https://default-api-url.com';
export const ENVIRONMENT = process.env.NODE_ENV || 'development';

// Add the Stripe publishable key here
export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Optionally, you can export the `env` object that contains all environment-related values
export const env = {
  API_URL,
  ENVIRONMENT,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
};
