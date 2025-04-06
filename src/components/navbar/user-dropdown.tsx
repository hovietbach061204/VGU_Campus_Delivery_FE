'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { env } from '@/env.mjs';
import * as m from '@/paraglide/messages';

export const UserDropdown = ({ session: { user } }: { session: Session }) => {
  const [isPending, setIsPending] = useState(false);

  const handleCreateCheckoutSession = async () => {
    setIsPending(true);

    try {
      const res = await fetch('/api/stripe/checkout-session');
      const { session: checkoutSession } = await res.json();
      if (!checkoutSession) {
        throw new Error('Session not found');
      }

      const stripe = await loadStripe(
        env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
      );
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      await stripe.redirectToCheckout({
        sessionId: checkoutSession.id,
      });
    } catch (error) {
      console.error('Checkout session creation failed', error);
      setIsPending(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          className="overflow-hidden rounded-full"
          src={user?.image ?? '/default-avatar.png'} // Fallback to default image if user has no image
          alt={user?.name ?? 'User'} // Default name if unavailable
          width={32}
          height={32}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{m.my_account()}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col items-center justify-center p-2">
          <Image
            className="overflow-hidden rounded-full"
            src={user?.image ?? '/default-avatar.png'}
            alt={user?.name ?? 'User'}
            width={100}
            height={100}
          />
          <h2 className="py-2 text-lg font-bold">{user?.name ?? 'Guest'}</h2>
          <Button
            onClick={handleCreateCheckoutSession}
            disabled={user?.isActive || isPending}
            className="w-64"
          >
            {user?.isActive ? (
              m.you_are_a_pro()
            ) : (
              <>
                {isPending && (
                  <Icons.loader className="mr-2 size-4 animate-spin" />
                )}
                {m.upgrade_to_pro_cta()}
              </>
            )}
          </Button>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <Icons.logOut className="mr-2 size-4" /> <span>{m.log_out()}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
