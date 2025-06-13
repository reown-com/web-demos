export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  sizes: string[]
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
}

export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export type PaymentMethod = 'credit-card' | 'crypto' 

// New types for AppKit Pay settings
export interface AppKitSettings {
  recipientAddress: string
  defaultPaymentAsset: 'baseUSDC' | 'baseETH' | 'baseSepoliaETH'
  projectId: string
  enableTestnet: boolean
}

export interface PaymentAssetOption {
  id: string
  name: string
  symbol: string
  network: string
  testnet: boolean
} 