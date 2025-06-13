import { cookieStorage, createStorage } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, baseSepolia } from '@reown/appkit/networks'
import type { Chain } from 'viem'


export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID


if (!projectId) {
    throw new Error('Project ID is not defined')
}

// Define supported networks for AppKit Pay
export const networks: [Chain, ...Chain[]] = [base, baseSepolia]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
      storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks
  })
  
  export const config = wagmiAdapter.wagmiConfig