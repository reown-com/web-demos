import { baseUSDC, baseETH, baseSepoliaETH } from '@reown/appkit-pay'
import { PaymentAssetOption } from './types'

// Payment asset options for the UI
export const paymentAssetOptions: PaymentAssetOption[] = [
  {
    id: 'baseUSDC',
    name: 'USDC',
    symbol: 'USDC',
    network: 'Base',
    testnet: false
  },
  {
    id: 'baseETH',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'Base',
    testnet: false
  },
  {
    id: 'baseSepoliaETH',
    name: 'Ethereum (Testnet)',
    symbol: 'ETH',
    network: 'Base Sepolia',
    testnet: true
  }
]

// Get payment asset by ID
export const getPaymentAsset = (id: string) => {
  switch (id) {
    case 'baseUSDC':
      return baseUSDC
    case 'baseETH':
      return baseETH
    case 'baseSepoliaETH':
      return baseSepoliaETH
    default:
      return baseUSDC
  }
} 