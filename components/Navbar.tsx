'use client'

import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const { isSignedIn } = useUser()

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">Kolumn</h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <div className="flex items-center space-x-3">
              <UserButton />
              <SignOutButton>
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </SignOutButton>
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
