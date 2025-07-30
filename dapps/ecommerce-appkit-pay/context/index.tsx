'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConstantsUtil, createAppKit } from '@reown/appkit/react'
import { abstract, arbitrum, aurora, base, baseSepolia, berachain, bitcoin, bitcoinTestnet, gnosis, hedera, mainnet, mantle, monadTestnet, optimism, polygon, sepolia, solana, solanaDevnet, solanaTestnet, unichainSepolia } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import type { AppKitNetwork } from '@reown/appkit/networks'


// Set up queryClient
const queryClient = new QueryClient()



const networks = [
    abstract,
    arbitrum,
    aurora,
    base,
    baseSepolia,
    berachain,
    bitcoin,
    bitcoinTestnet,
    gnosis,
    hedera,
    mainnet,
    mantle,
    monadTestnet,
    optimism,
    polygon,
    sepolia,
    solana,
    solanaDevnet,
    solanaTestnet,
    unichainSepolia,        
] as [AppKitNetwork, ...AppKitNetwork[]]

// Set up metadata
const metadata = {
  name: 'appkit-example',
  description: 'AppKit Example',
  url: 'https://appkitexampleapp.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const solanaWeb3JsAdapter = new SolanaAdapter()
  
const bitcoinAdapter = new BitcoinAdapter()


export const createModal = () => {
  if (!projectId) {
    throw new Error('Project ID is not defined')
  }
  
  createAppKit({
    adapters: [wagmiAdapter, solanaWeb3JsAdapter, bitcoinAdapter],
    projectId,
    networks,
    defaultNetwork: base,
    metadata: metadata,
    features: {
      analytics: true, // Optional - defaults to your Cloud configuratio
      pay: true
    }
  })
  
} 

createModal()

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider