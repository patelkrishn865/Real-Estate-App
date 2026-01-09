"use client";
import { Button } from "@/components/ui/button";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const pathName = usePathname();
  const { user, isSignedIn } = useUser();

  return (
    <div className="px-10 p-6 flex justify-between shadow-sm fixed top-0 w-full z-10 bg-white">
      <div className="flex gap-12 items-center">
        <Image src="/logoipsum.svg" alt="logo" width={50} height={50} />
        <ul className="hidden md:flex gap-10">
          <Link href="/">
            <li
              className={`font-medium text-sm hover:text-primary cursor-pointer ${
                pathName === "/" && "text-primary"
              }`}
            >
              For Sell
            </li>
          </Link>
          <Link href="/rent">
            <li
              className={`font-medium text-sm hover:text-primary cursor-pointer ${
                pathName === "/rent" && "text-primary"
              }`}
            >
              For Rent
            </li>
          </Link>
          <li className="font-medium text-sm hover:text-primary cursor-pointer">
            Agent Finder
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-3">
        <Link href={"/add-new-listing"}>
          <Button className="flex gap-2 border py-5 cursor-pointer">
            <Plus className="h-5 w-5" /> Post Your Ad
          </Button>
        </Link>
        {isSignedIn ? (
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Image
                src={user?.imageUrl}
                width={35}
                height={35}
                alt="user profile"
                className="rounded-full"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Link href={'/user'}>Profile</Link></DropdownMenuItem>
              <DropdownMenuItem><Link href={'/user/my-listing'}>My Listing</Link></DropdownMenuItem>
              <DropdownMenuItem><SignOutButton>Logout</SignOutButton></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/sign-in">
            <Button variant="outline" className="py-5 cursor-pointer">
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
