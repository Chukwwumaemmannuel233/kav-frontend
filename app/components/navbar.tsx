'use client';

import { Search, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo on the left */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">LUXE</h1>
          </div>

          {/* Center spacer */}
          <div className="flex-1"></div>

          {/* Right side: Search, Join Now, Login */}
          <div className="flex items-center gap-4">
            {/* Search icon */}
            <button 
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>

            {/* Join Now button */}
            <Button 
              variant="outline"
              className="hidden sm:flex text-foreground border-foreground hover:bg-foreground hover:text-background"
            >
              Join Now
            </Button>

            {/* Login button */}
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Login</span>
              <span className="sm:hidden">Login</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
