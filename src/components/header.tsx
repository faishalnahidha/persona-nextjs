'use client';

import { useState, useEffect } from 'react';

import Link from "next/link";
import Image from "next/image";

import { IconLogin2 } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface HeaderProps {
  scrollEffect?: boolean;
}

export default function Header({ scrollEffect = true }: HeaderProps) {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!scrollEffect) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollEffect]);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 flex h-18 w-full transition-all duration-300",
      !scrollEffect || scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border'
        : 'bg-transparent'
    )}>
      <div className="container mx-auto flex items-center justify-between w-full px-6 md:px-10">
        <Link href="/">
          <Image
            src="/images/logo-persona-full.svg"
            alt="Persona My Id Logo"
            width={200}
            height={32}
            priority
          />
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="gap-0">
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} rounded-full btn-text-sm bg-transparent`}>
                <Link href="#artikel-panduan">Artikel Panduan</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} rounded-full btn-text-sm bg-transparent`}>
                <Link href="#blog">Blog</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} rounded-full btn-text-sm bg-transparent`}>
                <Link href="#buku">Buku (Legacy)</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild size="lg" className="rounded-full pl-6 pr-5 ml-4">
                <Link href="#login">Login <IconLogin2 /></Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
