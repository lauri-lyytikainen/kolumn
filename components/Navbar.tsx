'use client'

import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Navbar() {
  const { isSignedIn } = useUser()

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-primary">Kolumn</h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/#about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/#contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <div className="flex items-center space-x-3">
              {isSignedIn && (
                <Button asChild variant="outline">
                  <Link href="/dashboard">
                    Dashboard
                  </Link>
                </Button>
              )}
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button size="sm">
                  Get Started
                </Button>
              </SignInButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
