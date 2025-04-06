import React, { JSX } from 'react';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Separator from '@/components/ui/Separator';

export default function FooterSection(): JSX.Element {
  // Social media links data
  const socialLinks = [
    { icon: <Facebook className="size-5" />, href: '#' },
    { icon: <Twitter className="size-5" />, href: '#' },
    { icon: <Instagram className="size-5" />, href: '#' },
    { icon: <Linkedin className="size-5" />, href: '#' },
    { icon: <Youtube className="size-5" />, href: '#' },
  ];

  // Quick links data
  const quickLinks = [
    { text: 'Tracking', href: '#' },
    { text: 'Shipping', href: '#' },
    { text: 'Locations', href: '#' },
    { text: 'Support', href: '#' },
  ];

  // Contact info data
  const contactInfo = [
    { icon: <Phone className="size-4" />, text: 'Phone number here' },
    { icon: <Mail className="size-4" />, text: 'Email here' },
    { icon: <MapPin className="size-5" />, text: 'Address here' },
  ];

  return (
    <div className="w-full px-4 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row">
        {/* Left Column - Logo, Description, Social */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Image className="size-[54px] object-cover" alt="Logo" src="" />
            <h3 className="font-['Red_Rose-Bold',Helvetica] text-[22px] font-bold leading-7 text-white">
              Food Delivary
            </h3>
          </div>

          <p className="mt-6 max-w-[465px] font-['Red_Hat_Text-Medium',Helvetica] text-lg font-medium leading-7 text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam..
          </p>

          <div className="mt-10 flex gap-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-white transition-colors hover:text-gray-200"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Middle Column - Quick Links */}
        <div className="flex flex-1 flex-col gap-12 md:flex-row">
          <div>
            <h3 className="mb-6 font-['Red_Rose-Bold',Helvetica] text-[22px] font-bold leading-7 text-white">
              Quick link
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="font-['Red_Hat_Text-Medium',Helvetica] text-lg font-medium leading-[26px] text-white hover:underline"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="mb-6 font-['Red_Rose-Bold',Helvetica] text-[22px] font-bold leading-7 text-white">
              Contact us
            </h3>
            <ul className="space-y-8">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 text-white">{item.icon}</span>
                  <span className="font-['Red_Hat_Text-Medium',Helvetica] text-lg font-medium leading-[25px] text-white">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column - Subscribe */}
        <div className="flex-1">
          <h3 className="mb-6 font-['Red_Rose-Bold',Helvetica] text-[22px] font-bold leading-7 text-white">
            Subscribe
          </h3>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block font-['Red_Hat_Text-Medium',Helvetica] text-lg font-medium leading-7 text-white">
                Name
              </label>
              <Input className="border-none bg-transparent p-0 text-white focus-visible:ring-0 focus-visible:ring-offset-0" />
              <Separator className="mt-2 bg-white/50" />
            </div>

            <div>
              <label className="mb-2 block font-['Red_Hat_Text-Medium',Helvetica] text-lg font-medium leading-7 text-white">
                Email
              </label>
              <Input className="border-none bg-transparent p-0 text-white focus-visible:ring-0 focus-visible:ring-offset-0" />
              <Separator className="mt-2 bg-white/50" />
            </div>

            <Button className="mt-4 rounded-[10px] bg-[#fa9f3d] px-8 py-2 font-['Red_Rose-Regular',Helvetica] text-lg text-white shadow-[0px_4px_0px_#3cbd9640] hover:bg-[#e89435]">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
