"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import AuthButton from "@/components/auth/auth-button"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-foreground">
            Store Finder
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link 
              href="/" 
              className={`text-sm font-medium ${pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              Home
            </Link>
            <Link 
              href="/stores" 
              className={`text-sm font-medium ${pathname?.startsWith('/stores') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              Stores
            </Link>
            <Link 
              href="/dashboard" 
              className={`text-sm font-medium ${pathname?.startsWith('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/search">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </Link>
          <AuthButton />
        </div>
      </div>
    </header>
  )
}