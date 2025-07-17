'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Camera,
  History,
  Home,
  Image as ImageIcon,
  LogOut,
  Palette,
  Scissors,
  Sparkles,
  UserRound,
  PanelLeft,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { href: '/dashboard', icon: Palette, label: 'Generate' },
  { href: '/dashboard/enhance', icon: Sparkles, label: 'Enhance' },
  { href: '/dashboard/remove-bg', icon: Scissors, label: 'Remove BG' },
  { href: '/dashboard/photoshoot', icon: Camera, label: 'Photoshoot' },
  { href: '/dashboard/interior-design', icon: Home, label: 'Interior Design' },
  { href: '/dashboard/avatar', icon: UserRound, label: 'Avatar' },
  { href: '/dashboard/history', icon: History, label: 'History' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const NavLink = ({ href, icon: Icon, label }: typeof navItems[0]) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href}>
          <Button
            variant={pathname === href ? 'secondary' : 'ghost'}
            size="icon"
            className="rounded-lg"
            aria-label={label}
          >
            <Icon className="size-5" />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {label}
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
              href="/dashboard"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <Logo className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">Masterpiece AI</span>
            </Link>
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="@user" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="#"
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  >
                    <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">Masterpiece AI</span>
                  </Link>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-4 px-2.5',
                        pathname === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-headline font-semibold">
                {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
              </h1>
            </div>
          </header>
          <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
