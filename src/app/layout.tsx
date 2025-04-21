import '@/styles/globals.css';
import { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/toaster';

export const metadata = {
  title: 'Your App',
  description: 'Your app description',
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <body>
        <main className="grow">{children}</main>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
