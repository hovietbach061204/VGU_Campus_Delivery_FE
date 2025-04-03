import { Button } from "@/components/ui/button";
import React, {JSX} from "react";

export default function HeroSection(): JSX.Element {
    return (
        <section className="flex flex-col md:flex-row items-center justify-between gap-8 py-16 container mx-auto">
            {/* Left side image */}
            <div className="w-full md:w-1/2">
                <img
                    className="w-full max-w-[560px] h-auto"
                    alt="Restaurant illustration"
                    src=""
                    // This would be replaced with the actual image path in a real implementation
                />
            </div>

            {/* Right side content */}
            <div className="w-full md:w-1/2 flex flex-col gap-6">
                <h2 className="font-bold text-[#204944] text-4xl md:text-5xl leading-tight tracking-tight font-['Red_Rose-Bold',Helvetica]">
                    We have the Largest <br />
                    Restaurant Chain
                </h2>

                <p className="text-[#777e90] text-lg leading-7 font-['Red_Hat_Text-Regular',Helvetica]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>

                <div className="mt-4">
                    <Button className="bg-[#fdad00] hover:bg-[#e69d00] text-white font-bold text-xl px-8 py-6 h-auto rounded-[10px] shadow-[0px_8px_12px_#ffeaa273] font-['Red_Rose-Bold',Helvetica]">
                        Learn more
                    </Button>
                </div>
            </div>
        </section>
    );
}
