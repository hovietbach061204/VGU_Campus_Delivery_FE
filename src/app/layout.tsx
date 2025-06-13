import '@/styles/globals.css';
import { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { StagewiseToolbar } from '@stagewise/toolbar-next';
import { ReactPlugin } from '@stagewise-plugins/react';

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
        <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
      </body>
    </html>
  );
};

export default RootLayout;
