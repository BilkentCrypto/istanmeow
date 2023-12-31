"use client";

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { scrollSepolia } from 'viem/chains'

// 1. Get projectId
const projectId = '04c7f14afd89a5db5c2eb265519fe039'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [scrollSepolia]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

export function Web3Modal({ children }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}