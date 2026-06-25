'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

import Link from "next/link";
import Image from "next/image";

import { IconLogin2, IconMenu2, IconLogout } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const { data: session } = useSession();

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
        <div className="container mx-auto flex items-center justify-between pl-3 pr-4 md:pl-8 md:pr-10 lg:px-10">

          {/* Mobile: Logo + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <IconMenu2 />
            </Button>
            {/* <Link href="/">
              <Image
                src="/images/logo-persona-full.svg"
                alt="Persona My Id Logo"
                width={160}
                height={26}
                priority
              />
            </Link> */}
          </div>

          {/* Responsive Logo */}
          <Link href="/" className="block h-6.5 md:h-7 xl:h-8 mr-1">
            <Image
              src="/images/logo-persona-full.svg"
              alt="Persona My Id Logo"
              width={200}
              height={32}
              className="w-auto h-full"
              priority
            />
          </Link>

          {/* Mobile: Auth Icon */}
          {session ? (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full lg:hidden"
              aria-label="Sign out"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <IconLogout />
            </Button>
          ) : (
            <Button asChild size="icon" className="rounded-full lg:hidden pr-[2px]" aria-label="Login">
              <Link href="/login"><IconLogin2 /></Link>
            </Button>
          )}

          {/* Desktop: Nav */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-0">
              {navLinks.map(({ href, label }) => (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} rounded-full btn-text-sm bg-transparent`}>
                    <Link href={href}>{label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                {session ? (
                  <div className="flex items-center gap-3 ml-4">
                    <Avatar className="size-8">
                      <AvatarImage src={session.user?.image ?? undefined} alt={session.user?.name ?? 'User'} />
                      <AvatarFallback className="para-sm-bold">
                        {session.user?.name?.charAt(0).toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      <IconLogout className="size-4" />
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <Button asChild size="lg" className="rounded-full ml-4">
                    <Link href="/login">Login<IconLogin2 /></Link>
                  </Button>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} direction="left">
        <DrawerContent>
          <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
          <div className="px-4 pt-5 pb-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src="/images/logo-persona-full.svg"
                alt="Persona My Id Logo"
                width={200}
                height={32}
                priority
              />
            </Link>
          </div>
          <nav className="flex flex-col px-4 pb-6">
            {navLinks.map(({ href, label }) => (
              <DrawerClose key={href} asChild>
                <Link
                  href={href}
                  className="btn-text-sm py-4 border-b border-border last:border-b-0 text-foreground"
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
