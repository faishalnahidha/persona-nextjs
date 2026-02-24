'use client';

import { useState, useEffect } from 'react';

import Link from "next/link";
import Image from "next/image";

import { IconLogin2, IconMenu2 } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";

interface HeaderProps {
  scrollEffect?: boolean;
}

const navLinks = [
  { href: '#artikel-panduan', label: 'Artikel Panduan' },
  { href: '#blog', label: 'Blog' },
  { href: '#buku', label: 'Buku (Legacy)' },
];

export default function Header({ scrollEffect = true }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!scrollEffect) return;
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollEffect]);

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 flex h-14 md:h-18 w-full transition-all duration-300",
        !scrollEffect || scrolled
          ? 'bg-background/95 backdrop-blur-sm border-b border-border'
          : 'bg-transparent'
      )}>
        <div className="container mx-auto flex items-center justify-between w-full pl-3 pr-4 md:px-6 lg:px-10">

          {/* Mobile: Logo + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <IconMenu2 />
            </Button>
            <Link href="/">
              <Image
                src="/images/logo-persona-full.svg"
                alt="Persona My Id Logo"
                width={160}
                height={26}
                priority
              />
            </Link>
          </div>

          {/* Desktop: Logo */}
          <Link href="/" className="hidden md:block">
            <Image
              src="/images/logo-persona-full.svg"
              alt="Persona My Id Logo"
              width={200}
              height={32}
              priority
            />
          </Link>

          {/* Mobile: Login Icon */}
          <Button asChild size="icon" className="rounded-full md:hidden pr-[2px]" aria-label="Login">
            <Link href="#login"><IconLogin2 /></Link>
          </Button>

          {/* Desktop: Nav */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-4">
              {navLinks.map(({ href, label }) => (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} rounded-full btn-text-sm bg-transparent`}>
                    <Link href={href}>{label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <Button asChild size="lg" className="rounded-full pl-6 pr-5 ml-4">
                  <Link href="#login">Login <IconLogin2 /></Link>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} direction="left">
        <DrawerContent>
          <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
          <div className="px-4 pt-5 pb-3">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src="/images/logo-persona-full.svg"
                alt="Persona My Id Logo"
                width={160}
                height={26}
                priority
              />
            </Link>
          </div>
          <nav className="flex flex-col px-4 pb-6">
            {navLinks.map(({ href, label }) => (
              <DrawerClose key={href} asChild>
                <Link
                  href={href}
                  className="btn-text-sm py-3 border-b border-border last:border-b-0 text-foreground"
                >
                  {label}
                </Link>
              </DrawerClose>
            ))}
          </nav>
        </DrawerContent>
      </Drawer>
    </>
  );
}
