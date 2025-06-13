'use client'

import { Settings } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export function SettingsDrawer() {
  return (
    <>
      {/* Floating Settings Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-10 w-10 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 bg-card border border-border hover:bg-accent"
            >
              <Settings className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              <span className="sr-only">Open settings</span>
            </Button>
          </SheetTrigger>
          
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="pb-6">
              <SheetTitle className="flex items-center gap-2 text-xl">
                <Settings className="h-5 w-5" />
                Settings
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-6">
              <p className="text-muted-foreground text-center py-8">
                Settings content will be added here for demo purposes.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
} 