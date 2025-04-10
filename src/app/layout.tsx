import '@/styles/globals.css';

import { PropsWithChildren } from 'react';
import { LanguageProvider } from '@inlang/paraglide-next';

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
        <body
          className={cn(
            'flex min-h-screen flex-col justify-between font-sans',
            fonts
          )}
        >
          <ThemeProvider attribute="class">
            <main className="grow">{children}</main>

            {/* ThemeSwitcher in normal layout flow */}
            <div className="flex justify-end px-4 pb-4">
              <ThemeSwitcher />
            </div>

            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </LanguageProvider>
  );
};

export default RootLayout;
