'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Minus, Trash2, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { ShippingInfo, PaymentMethod } from '@/lib/types'
import { usePay } from '@reown/appkit-pay/react'
import { useAppKit } from '@reown/appkit/react'
import { useSettings } from '@/lib/settings-context'
import { getPaymentAsset } from '@/lib/appkit-config'
import { convertUSDToCrypto, getSymbolFromAssetId } from '@/lib/price-conversion'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()
  const { settings } = useSettings()
  const { close: closeAppKit } = useAppKit()
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  })
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('crypto')
  const [isLoadingConversion, setIsLoadingConversion] = useState(false)

  const handlePaymentSuccess = (data: any) => {
    console.log('Payment successful:', data)
    
    // Show success toast
    toast.success('Crypto payment completed!', {
      description: `Total: ${formatPrice(getTotalPrice())}`
    })
    
    // Close AppKit modal after 3 seconds and redirect
    setTimeout(() => {
      closeAppKit()
      
      // Prepare data for post-checkout page (before clearing cart)
      const queryParams = new URLSearchParams({
        txId: data,
        total: getTotalPrice().toString(),
        paymentMethod: 'crypto',
        paymentAsset: settings.defaultPaymentAsset,
        items: encodeURIComponent(JSON.stringify(items)),
        timestamp: Date.now().toString()
      })
      
      // Clear cart just before redirect
      clearCart()
      
      // Redirect to post-checkout page with query parameters
      router.push(`/post-checkout?${queryParams.toString()}`)
    }, 3000)
  }

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error)
    const errorMessage = typeof error === 'string' ? error : 'An unexpected error occurred'
    toast.error('Payment failed', {
      description: errorMessage
    })
  }

  const { open: openPay, isPending } = usePay({
    onSuccess: handlePaymentSuccess,
    onError: handlePaymentError,
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const handleShippingChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleQuantityChange = (productId: string, size: string, change: number) => {
    const item = items.find(i => i.product.id === productId && i.size === size)
    if (item) {
      const newQuantity = item.quantity + change
      if (newQuantity > 0) {
        updateQuantity(productId, size, newQuantity)
      }
    }
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!')
      return
    }
    
    if (paymentMethod === 'credit-card') {
      // Handle credit card payment
      toast.success('Checkout completed!', {
        description: `Payment method: Credit Card • Total: ${formatPrice(getTotalPrice())}`
      })
      
      // Prepare data for post-checkout page
      const queryParams = new URLSearchParams({
        txId: `cc_${Date.now()}`, // Fake transaction ID for credit card
        total: getTotalPrice().toString(),
        paymentMethod: 'credit-card',
        items: encodeURIComponent(JSON.stringify(items)),
        timestamp: Date.now().toString()
      })
      
      clearCart()
      router.push(`/post-checkout?${queryParams.toString()}`)
    } else {
      // Handle crypto payment with AppKit Pay
      if (!settings.recipientAddress) {
        toast.error('Recipient address not configured', {
          description: 'Please configure a recipient address in settings'
        })
        return
      }

      try {
        setIsLoadingConversion(true)
        const paymentAsset = getPaymentAsset(settings.defaultPaymentAsset)
        const cryptoSymbol = getSymbolFromAssetId(settings.defaultPaymentAsset)
        const usdAmount = getTotalPrice()
        
        let finalAmount = usdAmount
        
        // Check if we need to convert from USD to crypto
        if (cryptoSymbol !== 'USDC') {
          try {
            const conversion = await convertUSDToCrypto(usdAmount, cryptoSymbol)
            finalAmount = conversion.convertedAmount
          } catch (conversionError) {
            console.error('Price conversion failed:', conversionError)
            toast.error('Failed to get current crypto prices', {
              description: 'Please try again or check your internet connection'
            })
            setIsLoadingConversion(false)
            return
          }
        }
        
        setIsLoadingConversion(false)
        
        await openPay({
          paymentAsset,
          recipient: settings.recipientAddress,
          amount: finalAmount
        })
      } catch (error) {
        console.error('Failed to open AppKit Pay:', error)
        toast.error('Failed to open payment modal', {
          description: 'Please try again or check your configuration'
        })
        setIsLoadingConversion(false)
      }
    }
  }

  if (items.length === 0) {
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
            Back to Shop
          </Button>
          
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some items to your cart to continue shopping</p>
            <Button onClick={() => router.push('/')}>
              Continue Shopping
            </Button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Cart Items */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Items ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={`${item.product.id}-${item.size}`}>
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{item.product.name}</h3>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {item.size}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.product.id, item.size)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.product.id, item.size, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.product.id, item.size, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-semibold">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index < items.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleShippingChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleShippingChange('lastName', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => handleShippingChange('email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => handleShippingChange('address', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) => handleShippingChange('country', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment & Order Summary */}
          <div className="space-y-6">
            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
                  className="grid grid-cols-1 gap-4"
                >
                  <div className={`flex items-center space-x-3 rounded-lg border p-4 transition-all cursor-pointer hover:bg-accent/50 ${
                    paymentMethod === 'credit-card' ? 'border-primary bg-primary/5' : ''
                  }`}>
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex items-center cursor-pointer flex-1">
                      <div className="flex items-center space-x-3 mr-4">
                        <Image src="/payment-options/visa.svg" alt="Visa" width={32} height={20} className="h-5 w-auto" />
                        <Image src="/payment-options/mastercard.svg" alt="Mastercard" width={32} height={20} className="h-5 w-auto" />
                        <Image src="/payment-options/amex.svg" alt="American Express" width={32} height={20} className="h-5 w-auto" />
                      </div>
                      <div>
                        <div className="font-medium">Credit Card</div>
                        <div className="text-xs text-muted-foreground">Visa, Mastercard, Amex</div>
                      </div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 rounded-lg border p-4 transition-all cursor-pointer hover:bg-accent/50 ${
                    paymentMethod === 'crypto' ? 'border-primary bg-primary/5' : ''
                  }`}>
                    <RadioGroupItem value="crypto" id="crypto" />
                    <Label htmlFor="crypto" className="flex items-center cursor-pointer flex-1">
                      <div className="flex items-center space-x-3 mr-4">
                        <Image src="/payment-options/usdc.svg" alt="USDC" width={20} height={20} className="h-5 w-5" />
                        <Image src="/payment-options/ethereum.svg" alt="Ethereum" width={20} height={20} className="h-5 w-5 bg-white rounded-full p-0.5" />
                        <Image src="/payment-options/solana.svg" alt="Solana" width={20} height={20} className="h-5 w-5 bg-white rounded-full p-0.5" />
                      </div>
                      <div>
                        <div className="font-medium">Cryptocurrency</div>
                        <div className="text-xs text-muted-foreground">USDC, Ethereum, Solana</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                

                <Button 
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                  disabled={isPending || isLoadingConversion || (paymentMethod === 'crypto' && !settings.recipientAddress)}
                >
                  {isPending || isLoadingConversion ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isLoadingConversion ? 'Getting crypto price...' : 'Processing...'}
                    </>
                  ) : (
                    `Pay with ${paymentMethod === 'credit-card' ? 'Credit Card' : 'Crypto'}`
                  )}
                </Button>
                
                {paymentMethod === 'crypto' && !settings.recipientAddress && (
                  <p className="text-sm text-amber-600 text-center">
                    ⚠️ Configure recipient address in settings to enable crypto payments
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
} 