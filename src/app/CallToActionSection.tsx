import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";

export default function CallToActionSection(): JSX.Element {
    // Statistics data for mapping
    const stats = [
        { value: "350+", label: "Order per minute" },
        { value: "10x", label: "Faster delivery" },
        { value: "10+", label: "In Country" },
        { value: "99.9%", label: "Order accuracy" },
    ];

    return (
        <section className="w-full py-12 px-4">
            <Card className="w-full max-w-7xl mx-auto rounded-[30px] p-8 relative overflow-hidden">
                <CardContent className="p-0 flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <h2 className="text-[#204944] font-bold text-4xl md:text-5xl lg:text-[70px] leading-tight tracking-tight mb-12">
                            We deliver your food all over the school within{" "}
                            <span className="text-[#9757d7]">30 minutes</span>
                        </h2>

                        <div className="bg-[#9757d71a] rounded-[10px] flex items-center mb-12 overflow-hidden">
                            <Input
                                className="border-0 bg-transparent text-[#777e90] text-lg p-6 h-[82px] flex-1"
                                placeholder="Enter location address"
                                defaultValue=""
                            />
                            <Button className="bg-[#fa9f3d] hover:bg-[#fa9f3d]/90 text-white font-bold text-xl h-[82px] px-12 rounded-[10px]">
                                Explore
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-8 mt-4">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center md:items-start"
                                >
                  <span className="font-bold text-[#204944] text-4xl font-['Red_Rose-Bold',Helvetica]">
                    {stat.value}
                  </span>
                                    <span className="text-[#777e90] mt-2">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-shrink-0 self-end">
                        <img
                            className="w-full max-w-[516px] h-auto"
                            alt="Delivery person on motorbike"
                            src=""
                        />
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
