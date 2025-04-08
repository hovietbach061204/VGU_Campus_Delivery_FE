import '@/styles/globals.css';

import { PropsWithChildren } from 'react';
import { LanguageProvider } from '@inlang/paraglide-next';

import { Footer } from '@/components/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Toaster } from '@/components/ui/toaster';
import { fonts } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { languageTag } from '@/paraglide/runtime.js';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <LanguageProvider>
      <html lang={languageTag()} suppressHydrationWarning>
        <body className={cn('min-h-screen font-sans', fonts)}>
          <ThemeProvider attribute="class">
            {/* <Navbar /> */}
            {children}
            <ThemeSwitcher className="absolute bottom-5 right-5 z-10" />
            <Footer />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </LanguageProvider>
  );
};

export default RootLayout;
