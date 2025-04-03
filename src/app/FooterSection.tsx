import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Twitter,
    Youtube,
} from "lucide-react";
import React from "react";

export default function FooterSection(): JSX.Element {
    // Social media links data
    const socialLinks = [
        { icon: <Facebook className="h-5 w-5" />, href: "#" },
        { icon: <Twitter className="h-5 w-5" />, href: "#" },
        { icon: <Instagram className="h-5 w-5" />, href: "#" },
        { icon: <Linkedin className="h-5 w-5" />, href: "#" },
        { icon: <Youtube className="h-5 w-5" />, href: "#" },
    ];

    // Quick links data
    const quickLinks = [
        { text: "Tracking", href: "#" },
        { text: "Shipping", href: "#" },
        { text: "Locations", href: "#" },
        { text: "Support", href: "#" },
    ];

    // Contact info data
    const contactInfo = [
        { icon: <Phone className="h-4 w-4" />, text: "Phone number here" },
        { icon: <Mail className="h-4 w-4" />, text: "Email here" },
        { icon: <MapPin className="h-5 w-5" />, text: "Address here" },
    ];

    return (
        <div className="w-full py-12 px-4">
            <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
                {/* Left Column - Logo, Description, Social */}
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <img className="w-[54px] h-[54px] object-cover" alt="Logo" src="" />
                        <h3 className="font-bold text-[22px] text-white font-['Red_Rose-Bold',Helvetica] leading-7">
                            Food Delivary
                        </h3>
                    </div>

                    <p className="mt-6 text-white text-lg font-medium font-['Red_Hat_Text-Medium',Helvetica] leading-7 max-w-[465px]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                        ad minim veniam..
                    </p>

                    <div className="flex gap-3 mt-10">
                        {socialLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                {link.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Middle Column - Quick Links */}
                <div className="flex-1 flex flex-col md:flex-row gap-12">
                    <div>
                        <h3 className="font-bold text-[22px] text-white font-['Red_Rose-Bold',Helvetica] leading-7 mb-6">
                            Quick link
                        </h3>
                        <ul className="space-y-4">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-white text-lg font-medium font-['Red_Hat_Text-Medium',Helvetica] leading-[26px] hover:underline"
                                    >
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h3 className="font-bold text-[22px] text-white font-['Red_Rose-Bold',Helvetica] leading-7 mb-6">
                            Contact us
                        </h3>
                        <ul className="space-y-8">
                            {contactInfo.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-white mt-0.5">{item.icon}</span>
                                    <span className="text-white text-lg font-medium font-['Red_Hat_Text-Medium',Helvetica] leading-[25px]">
                    {item.text}
                  </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column - Subscribe */}
                <div className="flex-1">
                    <h3 className="font-bold text-[22px] text-white font-['Red_Rose-Bold',Helvetica] leading-7 mb-6">
                        Subscribe
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="text-white text-lg font-medium font-['Red_Hat_Text-Medium',Helvetica] leading-7 block mb-2">
                                Name
                            </label>
                            <Input className="bg-transparent border-none p-0 text-white focus-visible:ring-0 focus-visible:ring-offset-0" />
                            <Separator className="mt-2 bg-white/50" />
                        </div>

                        <div>
                            <label className="text-white text-lg font-medium font-['Red_Hat_Text-Medium',Helvetica] leading-7 block mb-2">
                                Email
                            </label>
                            <Input className="bg-transparent border-none p-0 text-white focus-visible:ring-0 focus-visible:ring-offset-0" />
                            <Separator className="mt-2 bg-white/50" />
                        </div>

                        <Button className="bg-[#fa9f3d] hover:bg-[#e89435] text-white rounded-[10px] shadow-[0px_4px_0px_#3cbd9640] font-['Red_Rose-Regular',Helvetica] text-lg px-8 py-2 mt-4">
                            Subscribe
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
