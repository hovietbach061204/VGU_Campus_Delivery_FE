import { Card, CardContent } from "@/components/ui/card";
import React, {JSX} from "react";

export default function FeaturedDishesSection(): JSX.Element {
    return (
        <section className="flex flex-row items-center justify-between gap-8 w-full py-16">
            <div className="flex flex-col max-w-[645px] space-y-6">
                <h2 className="font-bold text-[50px] leading-[58px] tracking-[0.25px] text-[#2e2c49] font-['Red_Rose-Bold',Helvetica]">
                    Delicious and healthy food for your body
                </h2>
                <p className="text-lg leading-7 text-[#777e90] font-['Red_Hat_Text-Regular',Helvetica]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
            </div>

            <div className="relative">
                <Card className="border-none shadow-none">
                    <CardContent className="p-0">
                        {/* Delivery person illustration */}
                        <div className="relative w-[615px] h-[533px]">
                            {/* This is a simplified representation of the complex illustration */}
                            <img
                                src=""
                                alt="Delivery person on a scooter carrying food"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
