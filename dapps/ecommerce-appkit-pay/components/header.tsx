'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export function Header() {
  const { getTotalItems } = useCart()
  const itemCount = getTotalItems()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/reown-logo.png"
              alt="Reown"
              width={72}
              height={72}
              className="object-contain"
            />
            <span className="text-xl font-bold">Demo Shop</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/checkout">
            <Button>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Checkout{itemCount > 0 && ` (${itemCount})`}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
} 