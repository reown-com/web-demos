'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, ArrowLeft, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function PostCheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [copiedTxId, setCopiedTxId] = useState(false)

  // Extract data from query parameters
  const txId = searchParams.get('txId')
  const total = searchParams.get('total')
  const paymentMethod = searchParams.get('paymentMethod')
  const paymentAsset = searchParams.get('paymentAsset')
  const items = searchParams.get('items')
  const timestamp = searchParams.get('timestamp')


  // Parse items if available
  const parsedItems = items ? JSON.parse(decodeURIComponent(items)) : []

  // Format price helper
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numPrice)
  }

  // Format date helper
  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp)).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleCopyTxId = async () => {
    if (txId) {
      try {
        await navigator.clipboard.writeText(txId)
        setCopiedTxId(true)
        toast.success('Transaction ID copied to clipboard')
        setTimeout(() => setCopiedTxId(false), 2000)
      } catch (error) {
        toast.error('Failed to copy transaction ID')
      }
    }
  }



  if (!txId || !total) {
    // Redirect to home if no transaction data
    useEffect(() => {
      router.push('/')
    }, [router])
    
    return null
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Transaction ID</span>
                    <div className="flex items-center gap-2 text-right">
                      <code className="text-xs bg-muted px-2 py-1 rounded max-w-[200px] truncate">
                        {txId}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyTxId}
                      >
                        {copiedTxId ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Method</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {paymentMethod === 'crypto' ? 'Cryptocurrency' : 'Credit Card'}
                      </Badge>
                      {paymentAsset && (
                        <Badge variant="outline" className="text-xs">
                          {paymentAsset}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                    <span className="font-semibold text-lg">{formatPrice(total)}</span>
                  </div>
                  
                  {timestamp && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date & Time</span>
                      <span className="text-sm">{formatDate(timestamp)}</span>
                    </div>
                  )}


                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            {parsedItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {parsedItems.map((item: any, index: number) => (
                                         <div key={`${item.product.id}-${item.size}`}>
                       <div className="flex gap-3">
                         <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                           <Image
                             src={item.product.image}
                             alt={item.product.name}
                             width={48}
                             height={48}
                             className="w-full h-full object-cover"
                           />
                         </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm">{item.product.name}</h4>
                              <div className="flex gap-2 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  Size: {item.size}
                                </Badge>
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <span className="font-medium text-sm">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {index < parsedItems.length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                  
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Next Steps */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">📧 Confirmation Email</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a confirmation email with your order details shortly.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">🚚 Shipping Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    We'll notify you when your order ships with tracking information.
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={() => router.push('/')} className="w-full">
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
} 