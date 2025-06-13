import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/data'

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Premium Apparel & Accessories</h1>
          <p className="text-lg text-muted-foreground">
            Discover our collection of high-quality t-shirts, cozy hoodies, and stylish tote bags
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </>
  )
}
