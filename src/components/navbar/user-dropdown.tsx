'use client';

import Image from 'next/image';
import { Session } from 'next-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UserDropdown = ({ session: { user } }: { session: Session }) => {
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
        </div>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
