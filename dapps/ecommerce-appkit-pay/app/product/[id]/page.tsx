'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Plus, Minus } from 'lucide-react'
import { products } from '@/lib/data'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  
  const product = products.find(p => p.id === params.id)
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '')
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Product not found</p>
        </div>
      </>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'tshirt':
        return 'T-Shirt'
      case 'hoodie':
        return 'Hoodie'
      case 'tote':
        return 'Tote Bag'
      default:
        return category
    }
  }

  const handleAddToCart = () => {
    // Use selected size or default (first available option)
    const sizeToUse = selectedSize || product.sizes[0]
    
    addItem(product, sizeToUse, quantity)
    toast.success('Item added to cart!', {
      description: `${product.name} - ${sizeToUse} (${quantity}x)`
    })
  }

  const updateQuantity = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {getCategoryLabel(product.category)}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Size (Optional)</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className="min-w-12"
                  >
                    {size}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Default: {product.sizes[0]}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg">Total:</span>
                  <span className="text-2xl font-bold">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
                <Button 
                  onClick={handleAddToCart}
                  className="w-full"
                  size="lg"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
} 