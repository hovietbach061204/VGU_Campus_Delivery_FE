import { SignInButton } from '@/components/navbar/sign-in-button';

export const Navbar = async () => {
  return (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <SignInButton />
        </div>
      </div>
    </header>
  );
};
