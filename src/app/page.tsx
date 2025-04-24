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
            <div className="mx-auto w-full max-w-[869px] px-4 py-12 text-center sm:px-6 lg:px-8">
              <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-[#204944] sm:text-4xl md:text-5xl">
                What our Clients Say
              </h2>
              <p className="text-base font-normal leading-relaxed text-[#777e90] sm:text-lg">
                Something inspiring here
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
            <div className="container mx-auto p-4 text-center">
              <p className="text-base font-medium text-white sm:text-lg md:text-xl">
                Copyright 2023 | Uitaskca - All rights Reserved
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
