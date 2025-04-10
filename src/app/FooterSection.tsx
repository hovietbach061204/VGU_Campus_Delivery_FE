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
  const socialLinks = [
    { icon: <Facebook className="size-5" />, href: '#' },
    { icon: <Twitter className="size-5" />, href: '#' },
    { icon: <Instagram className="size-5" />, href: '#' },
    { icon: <Linkedin className="size-5" />, href: '#' },
    { icon: <Youtube className="size-5" />, href: '#' },
  ];

  const quickLinks = [
    { text: 'Tracking', href: '#' },
    { text: 'Shipping', href: '#' },
    { text: 'Locations', href: '#' },
    { text: 'Support', href: '#' },
  ];

  const contactInfo = [
    { icon: <Phone className="size-4" />, text: 'Phone number here' },
    { icon: <Mail className="size-4" />, text: 'Email here' },
    { icon: <MapPin className="size-5" />, text: 'Address here' },
  ];

  return (
    <div className="w-full bg-[#ff785b] px-4 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row">
        {/* Left Column */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <div className="flex items-center gap-3">
            <Image
              className="size-[54px] object-cover"
              alt="Logo"
              src="/images/logo.png"
              width={54}
              height={54}
            />
            <h3 className="font-['Red_Rose-Bold',Helvetica] text-[22px] font-bold leading-7 text-white">
              Food Delivery
            </h3>
          </div>

          <p className="mt-6 max-w-md font-['Red_Hat_Text-Medium',Helvetica] text-base font-medium leading-7 text-white sm:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
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

        {/* Middle Column */}
        <div className="flex flex-1 flex-col gap-12 sm:flex-row sm:justify-center">
          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-['Red_Rose-Bold',Helvetica] text-xl font-bold text-white sm:text-[22px]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="font-['Red_Hat_Text-Medium',Helvetica] text-base text-white hover:underline sm:text-lg"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-['Red_Rose-Bold',Helvetica] text-xl font-bold text-white sm:text-[22px]">
              Contact Us
            </h3>
            <ul className="space-y-6">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 text-white">{item.icon}</span>
                  <span className="font-['Red_Hat_Text-Medium',Helvetica] text-base text-white sm:text-lg">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column - Subscribe */}
        <div className="flex-1">
          <h3 className="mb-4 font-['Red_Rose-Bold',Helvetica] text-xl font-bold text-white sm:text-[22px]">
            Subscribe
          </h3>

          <div className="space-y-6">
            <div>
              <label className="mb-1 block font-['Red_Hat_Text-Medium',Helvetica] text-base font-medium text-white sm:text-lg">
                Name
              </label>
              <Input className="w-full border-none bg-transparent p-0 text-white placeholder:text-white focus-visible:ring-0 focus-visible:ring-offset-0" />
              <Separator className="mt-2 bg-white/50" />
            </div>

            <div>
              <label className="mb-1 block font-['Red_Hat_Text-Medium',Helvetica] text-base font-medium text-white sm:text-lg">
                Email
              </label>
              <Input className="w-full border-none bg-transparent p-0 text-white placeholder:text-white focus-visible:ring-0 focus-visible:ring-offset-0" />
              <Separator className="mt-2 bg-white/50" />
            </div>

            <Button className="mt-4 rounded-[10px] bg-[#fa9f3d] px-6 py-2 text-base font-semibold text-white hover:bg-[#e89435] sm:text-lg">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
