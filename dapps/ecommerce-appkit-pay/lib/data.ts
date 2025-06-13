import { Product } from './types'

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Cotton T-Shirt',
    description: 'Comfortable, everyday cotton t-shirt with a perfect fit.',
    price: 29.99,
    image: '/products/cotton-tshirt.png',
    category: 'tshirt',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '2',
    name: 'Premium Hoodie',
    description: 'Soft, warm hoodie made from premium organic cotton blend.',
    price: 79.99,
    image: '/products/premium-hoodie.png',
    category: 'hoodie',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '3',
    name: 'Canvas Tote Bag',
    description: 'Durable canvas tote bag perfect for everyday use.',
    price: 24.99,
    image: '/products/tote-bag.png',
    category: 'tote',
    sizes: ['One Size']
  },
  {
    id: '4',
    name: 'Vintage Wash T-Shirt',
    description: 'Relaxed fit t-shirt with vintage wash for a lived-in look.',
    price: 34.99,
    image: '/products/vintage-tshirt.png',
    category: 'tshirt',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  }
] 