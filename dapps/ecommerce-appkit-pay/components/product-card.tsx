'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
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

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg h-full flex flex-col p-0">
        <div className="aspect-square overflow-hidden relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {getCategoryLabel(product.category)}
            </Badge>
            <span className="text-lg font-bold">
              {formatPrice(product.price)}
            </span>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {product.description}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{product.sizes.length} sizes available</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 