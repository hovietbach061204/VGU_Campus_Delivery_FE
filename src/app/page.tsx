import React, { JSX } from 'react';

import CallToActionSection from './CallToActionSection';
import DeliveryInfoSection from './DeliveryInfoSection';
import FeaturedDishesSection from './FeaturedDishesSection';
import FooterSection from './FooterSection';
import HeroSection from './HeroSection';
import MenuSection from './MenuSection';
import { NavigationHeader } from './NavigationHeader';

export default function Courier(): JSX.Element {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-gradient-to-b from-white via-orange-50 to-white">
      <div className="relative w-full overflow-hidden">
        <section id="testimonials" className="bg-white px-4 py-12">
          <NavigationHeader />
        </section>
        <main className="space-y-24 px-4 md:px-8 lg:px-16">
          {/* Call to action section */}
          <section id="call-to-action">
            <CallToActionSection />
          </section>

          {/* Featured dishes */}
          <section id="featured" className="rounded-xl bg-orange-50 p-6 shadow">
            <FeaturedDishesSection />
          </section>

          {/* Delivery info section */}
          <section id="delivery-info" className="relative z-10">
            <DeliveryInfoSection />
          </section>
          {/* Hero section */}
          <section className="pt-12" id="hero">
            <HeroSection />
          </section>

          {/* Menu section */}
          <section id="menu" className="rounded-xl bg-white p-6 shadow-inner">
            <MenuSection />
          </section>

          {/* Footer */}
          <section id="footer" className="bg-[#ff785b]">
            <FooterSection />
            <div className="container mx-auto p-4 text-center">
              <p className="text-base font-medium text-white sm:text-lg md:text-xl">
                © 2023 Uitaskca - All rights Reserved
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
