"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface CheckoutButtonProps {
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  total?: number
  itemCount?: number
  className?: string
}

export function CheckoutButton({ 
  onClick, 
  disabled = false, 
  loading = false, 
  total = 0, 
  itemCount = 0,
  className 
}: CheckoutButtonProps) {
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(total)

  return (
    <Button
      variant="checkout"
      size="checkout"
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
    >
      <ShoppingCart className="h-5 w-5" />
      {loading ? (
        <span className="animate-pulse">Processing...</span>
      ) : (
        <span>
          Checkout {itemCount > 0 && `(${itemCount})`} {total > 0 && `• ${formattedTotal}`}
        </span>
      )}
    </Button>
  )
}

// Demo component showing different button states
export function CheckoutButtonDemo() {
  return (
    <div className="space-y-4 p-6">
      <h3 className="text-lg font-semibold">Checkout Button Demo</h3>
      <div className="space-y-3">
        <CheckoutButton 
          total={99.99} 
          itemCount={3} 
          onClick={() => console.log('Checkout clicked')}
        />
        <CheckoutButton 
          loading={true}
          total={99.99} 
          itemCount={3}
        />
        <CheckoutButton 
          disabled={true}
          total={0} 
          itemCount={0}
        />
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Other Button Sizes with Hover Effect:</h4>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="default">Small Button</Button>
          <Button size="default" variant="secondary">Default Button</Button>
          <Button size="lg" variant="outline">Large Button</Button>
          <Button size="icon" variant="ghost">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 