'use client';

import { UserButton } from "@clerk/nextjs";

export default function ClerkUserButton() {
  return (
    <UserButton 
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: "w-10 h-10",
          userButtonBox: "h-10"
        }
      }}
    />
  );
}