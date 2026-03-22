'use client'

import { SignInButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { PersonStanding, SquareKanban, Users, Zap } from "lucide-react"

export default function Home() {
  const { isSignedIn } = useUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/50 py-24 sm:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Organize your projects with
                <span className="text-primary"> Kolumn</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Simple, powerful kanban boards that help teams stay organized and productive.
                Create boards, add tasks, and track progress with ease.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {isSignedIn ? (
                  <Button size="lg" className="px-8" onClick={() => window.location.href = '/dashboard'}>
                    Go to Dashboard
                  </Button>
                ) : (
                  <SignInButton mode="modal">
                    <Button size="lg" className="px-8">
                      Get Started Free
                    </Button>
                  </SignInButton>
                )}
                <Button variant="outline" size="lg" className="px-8">
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 sm:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Everything you need to stay organized
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Built with simplicity and power in mind. Focus on what matters.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-5xl">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative rounded-lg border border-border bg-card p-6 shadow-sm">
                  <div className="text-primary mb-4">
                    <SquareKanban />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">
                    Kanban Boards
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Visual project management with drag-and-drop cards to track tasks from start to finish.
                  </p>
                </div>

                <div className="relative rounded-lg border border-border bg-card p-6 shadow-sm">
                  <div className="text-primary mb-4">
                    <Users />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">
                    Team Collaboration
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Invite team members, assign tasks, and collaborate in real-time with seamless updates.
                  </p>
                </div>

                <div className="relative rounded-lg border border-border bg-card p-6 shadow-sm">
                  <div className="text-primary mb-4">
                    <Zap />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">
                    Fast & Responsive
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Built for speed with real-time updates and a responsive design that works anywhere.
                  </p>
                </div>
                <div className="relative rounded-lg border border-border bg-card p-6 shadow-sm">
                  <div className="text-primary mb-4">
                    <PersonStanding />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">
                  Modern and Easy to Use
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Easy and intuitive to use, even for new developers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Ready to get organized?
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Start managing your projects with Kolumn today. No credit card required.
              </p>
              <div className="mt-10">
                {isSignedIn ? (
                  <Button size="lg" className="px-8" onClick={() => window.location.href = '/dashboard'}>
                    Go to Dashboard
                  </Button>
                ) : (
                  <SignInButton mode="modal">
                    <Button size="lg" className="px-8">
                      Start Free Now
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
