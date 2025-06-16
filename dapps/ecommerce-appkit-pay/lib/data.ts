import { Product } from './types'

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Cotton T-Shirt',
    description: 'Comfortable, everyday cotton t-shirt with a perfect fit.',
    price: 10,
    image: '/products/reown/tshirt-back.png',
    category: 'tshirt',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '2',
    name: 'Premium Reown Cap',
    description: 'Stylish cap featuring the Reown logo, perfect for any casual outfit.',
    price: 5.99,
    image: '/products/reown/cap-front.jpg',
    category: 'cap',
    sizes: ['One Size']
  },
  {
    id: '3',
    name: 'Canvas Tote Bag',
    description: 'Durable canvas tote bag perfect for everyday use.',
    price: 1.2,
    image: '/products/reown/tote.jpg',
    category: 'tote',
    sizes: ['One Size']
  },
  {
    id: '4',
    name: 'Premium Reown T-Shirt',
    description: 'High-quality premium t-shirt with Reown branding.',
    price: 29.99,
    image: '/products/reown/reown-premium-tshirt.png',
    category: 'tshirt',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  }
] 