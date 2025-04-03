import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import React, {JSX} from "react";

export const TestimonialsSection = (): JSX.Element => {
    // Navigation menu items
    const navItems = [
        { label: "Home", isBold: true },
        { label: "Tracking", isBold: false },
        { label: "Shipping", isBold: false },
        { label: "Locations", isBold: false },
        { label: "Support", isBold: false },
    ];

    return (
        <header className="relative w-full bg-[#ff785b] py-10">
            <div className="relative overflow-hidden">
                {/* Decorative vectors */}
                <div className="absolute w-[627px] h-[194px] top-[5px] left-0">
                    <img className="w-full h-full" alt="Decorative vector" src="" />
                </div>

                <div className="absolute w-[627px] h-[152px] bottom-0 right-0">
                    <img className="w-full h-full" alt="Decorative vector" src="" />
                </div>

                {/* Main navigation container */}
                <div className="container mx-auto flex items-center justify-between px-4">
                    {/* Logo and brand name */}
                    <div className="flex items-center gap-5">
                        <img
                            className="w-[54px] h-[54px] object-cover"
                            alt="Food Delivery Logo"
                            src=""
                        />
                        <div className="[font-family:'Red_Rose-Bold',Helvetica] font-bold text-white text-[22px] leading-7">
                            Food Delivery
                        </div>
                    </div>

                    {/* Navigation and auth section */}
                    <div className="flex items-center gap-[275px]">
                        {/* Main navigation */}
                        <NavigationMenu>
                            <NavigationMenuList className="flex items-center gap-[45px]">
                                {navItems.map((item, index) => (
                                    <NavigationMenuItem key={index}>
                                        <NavigationMenuLink
                                            className={`text-[22px] leading-[26px] text-white ${
                                                item.isBold
                                                    ? "[font-family:'Red_Hat_Text-Bold',Helvetica] font-bold"
                                                    : "[font-family:'Red_Hat_Text-Medium',Helvetica] font-medium"
                                            }`}
                                        >
                                            {item.label}
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>

                        {/* Auth section */}
                        <div className="flex items-center gap-[35px]">
                            <div className="[font-family:'Red_Hat_Text-Medium',Helvetica] font-medium text-white text-xl leading-[26px]">
                                Signin
                            </div>
                            <Button
                                variant="outline"
                                className="w-[129px] h-[47px] rounded-[10px] border-2 border-solid border-white bg-transparent text-white [font-family:'Red_Hat_Text-Medium',Helvetica] font-medium text-xl"
                            >
                                Register
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TestimonialsSection;
