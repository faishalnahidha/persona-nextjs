import Link from "next/link";
import Image from "next/image";

import { IconLogin2 } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function SiteHeader() {
  return (
    <header className="flex h-18 w-full">
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
              <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} rounded-full btn-text-sm`}>
                <Link href="#artikel-panduan">Artikel Panduan</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} rounded-full btn-text-sm`}>
                <Link href="#blog">Blog</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} rounded-full btn-text-sm`}>
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
