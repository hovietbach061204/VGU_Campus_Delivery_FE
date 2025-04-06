// src/components/ui/NavigationMenu.tsx
import React, { FC } from 'react';

interface NavigationMenuProps {
  children: React.ReactNode;
  className?: string; // Allow className as an optional prop
}

const NavigationMenu: FC<NavigationMenuProps> = ({ children, className }) => {
  return (
    <nav className={`rounded-md bg-gray-800 p-4 ${className}`}>{children}</nav>
  );
};

interface NavigationMenuListProps {
  children: React.ReactNode;
  className?: string; // Allow className as an optional prop
}

const NavigationMenuList: FC<NavigationMenuListProps> = ({
  children,
  className,
}) => {
  return <ul className={`flex space-x-4 ${className}`}>{children}</ul>;
};

interface NavigationMenuItemProps {
  children: React.ReactNode;
  className?: string; // Allow className as an optional prop
}

const NavigationMenuItem: FC<NavigationMenuItemProps> = ({
  children,
  className,
}) => {
  return <li className={`${className}`}>{children}</li>;
};

interface NavigationMenuLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string; // Allow className as an optional prop
}

const NavigationMenuLink: FC<NavigationMenuLinkProps> = ({
  href,
  children,
  className,
}) => {
  return (
    <a href={href} className={`text-white hover:text-gray-400 ${className}`}>
      {children}
    </a>
  );
};

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
};
