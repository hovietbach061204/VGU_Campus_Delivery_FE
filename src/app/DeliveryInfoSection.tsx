import { Card, CardContent } from "@/components/ui/card";
import { Bike, MapPin, Store, Utensils } from "lucide-react";
import React from "react";

export default function DeliveryInfoSection(): JSX.Element {
    // Data for delivery steps
    const deliverySteps = [
        {
            id: 1,
            title: "Choose your location",
            description:
                "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            icon: <MapPin size={42} className="text-[#204944]" />,
        },
        {
            id: 2,
            title: "Select Restaurant",
            description:
                "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            icon: <Store size={42} className="text-[#204944]" />,
        },
        {
            id: 3,
            title: "Make your order",
            description:
                "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            icon: <Utensils size={42} className="text-[#204944]" />,
        },
        {
            id: 4,
            title: "Food is on the way",
            description:
                "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            icon: <Bike size={42} className="text-[#204944]" />,
        },
    ];

    return (
        <div className="w-full py-12">
            <div className="flex flex-wrap gap-5 justify-between">
                {deliverySteps.map((step) => (
                    <div key={step.id} className="flex flex-col items-start">
                        <div className="relative mb-6">
                            <div className="w-[74px] h-[74px] bg-white rounded-full flex items-center justify-center">
                                {step.icon}
                            </div>
                        </div>

                        <Card className="w-[385px] h-[341px] bg-[#ffedd1] rounded-[17px] border-none">
                            <CardContent className="pt-8 px-8">
                                <h3 className="font-bold text-[22px] text-[#204944] leading-6 mb-6 font-['Red_Rose-Bold',Helvetica]">
                                    {step.title}
                                </h3>
                                <p className="text-lg text-[#777e90] leading-[26px] font-['Red_Hat_Text-Regular',Helvetica]">
                                    {step.description}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
