import { baseUSDC, baseETH, baseSepoliaETH } from '@reown/appkit-pay'
import { PaymentAssetOption, CustomAssetConfig } from './types'

// Solana USDC asset definition
const solanaUSDC = {
  network: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    metadata: {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6
    }
}


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
  },
  {
    id: 'solanaUSDC',
    name: 'USDC',
    symbol: 'USDC',
    network: 'Solana',
    testnet: false
  },
  {
    id: 'custom',
    name: 'Custom Asset',
    symbol: 'CUSTOM',
    network: 'Custom',
    testnet: false
  }
]

// Get payment asset by ID
export const getPaymentAsset = (id: string, customAsset?: CustomAssetConfig) => {
  switch (id) {
    case 'baseUSDC':
      return baseUSDC
    case 'baseETH':
      return baseETH
    case 'baseSepoliaETH':
      return baseSepoliaETH
    case 'solanaUSDC':
      return solanaUSDC
    case 'custom':
      if (customAsset) {
        return {
          network: customAsset.network,
          asset: customAsset.asset,
          metadata: customAsset.metadata
        }
      }
      // Fallback to baseUSDC if no custom asset configured
      return baseUSDC
    default:
      return baseUSDC
  }
} 