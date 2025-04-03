import React from "react";
import { CallToActionSection } from "./CallToActionSection";
import { DeliveryInfoSection } from "./DeliveryInfoSection";
import { FeaturedDishesSection } from "./FeaturedDishesSection";
import { FooterSection } from "./FooterSection";
import { HeroSection } from "./HeroSection";
import { MenuSection } from "./MenuSection";
import { TestimonialsSection } from "./TestimonialsSection";

export default function Courier(): JSX.Element {
    return (
        <div className="bg-white flex flex-col items-center justify-center w-full">
            <div className="bg-white w-full overflow-hidden relative">
                {/* Main content container with proper section ordering based on the image */}
                <main>
                    {/* Testimonials section with heading */}
                    <section className="relative">
                        <div className="w-full max-w-[869px] mx-auto text-center py-12">
                            <h2 className="font-bold text-[#204944] text-[50px] tracking-[-1px] leading-[56px] mb-6">
                                What our Clients Say
                            </h2>
                            <p className="font-normal text-[#777e90] text-lg leading-[30px]">
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
                        <div className="container mx-auto text-center py-4">
                            <p className="text-white text-[22px] font-medium">
                                Copyright 2023 | Uitaskca - All rights Reserved
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
