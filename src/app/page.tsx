import React, { JSX } from 'react';

import CallToActionSection from './CallToActionSection';
import DeliveryInfoSection from './DeliveryInfoSection';
import FeaturedDishesSection from './FeaturedDishesSection';
import FooterSection from './FooterSection';
import HeroSection from './HeroSection';
import MenuSection from './MenuSection';
import { TestimonialsSection } from './TestimonialSection';

export default function Courier(): JSX.Element {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-white">
      <div className="relative w-full overflow-hidden bg-white">
        {/* Main content container with proper section ordering based on the image */}
        <main>
          {/* Testimonials section with heading */}
          <section className="relative">
            <div className="mx-auto w-full max-w-[869px] py-12 text-center">
              <h2 className="mb-6 text-[50px] font-bold leading-[56px] tracking-[-1px] text-[#204944]">
                What our Clients Say
              </h2>
              <p className="text-lg font-normal leading-[30px] text-[#777e90]">
                Duis aute irure dolor in reprehenderit in voluptate cillum
                dolore eu fugiat nulla pariatur.
              </p>
            </div>
            <TestimonialsSection />
          </section>

          {/* Call to action section */}
          <section>
            <CallToActionSection />
          </section>

          {/* Delivery info section */}
          <section>
            <DeliveryInfoSection />
          </section>

          {/* Hero section */}
          <section>
            <HeroSection />
          </section>

          {/* Menu section */}
          <section>
            <MenuSection />
          </section>

          {/* Featured dishes section */}
          <section>
            <FeaturedDishesSection />
          </section>

          {/* Footer section */}
          <section className="bg-[#ff785b]">
            <FooterSection />
            <div className="container mx-auto py-4 text-center">
              <p className="text-[22px] font-medium text-white">
                Copyright 2023 | Uitaskca - All rights Reserved
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
