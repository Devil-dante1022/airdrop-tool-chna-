export const ChainId = {
  ETHEREUM: 1,
  BSC_MAINNET: 56,
  FANTOM: 250,
  MATIC: 137,
  AVALANCHE: 43114,
  CRONOS: 25,
}

export const DEFAULT_CHAIN_ID = process.env.REACT_APP_NETWORK_ID

export const NETWORKS = {
  [ChainId.ETHEREUM]: {
    chainId: `0x${Number(ChainId.ETHEREUM).toString(16)}`,
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://brewlabs-rpc.netlify.app/.netlify/functions/server'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  [ChainId.BSC_MAINNET]: {
    chainId: `0x${Number(ChainId.BSC_MAINNET).toString(16)}`,
    chainName: 'Binance Smart Chain Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed1.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  [ChainId.FANTOM]: {
    chainId: `0x${Number(ChainId.FANTOM).toString(16)}`,
    chainName: 'Fantom Opera',
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ftm.tools'],
    blockExplorerUrls: ['https://ftmscan.com'],
  },
  [ChainId.MATIC]: {
    chainId: `0x${Number(ChainId.MATIC).toString(16)}`,
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'Matic Token',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  [ChainId.AVALANCHE]: {
    chainId: `0x${Number(ChainId.AVALANCHE).toString(16)}`,
    chainName: 'Avalanche C-Chain',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io'],
  },
  [ChainId.CRONOS]: {
    chainId: `0x${Number(ChainId.CRONOS).toString(16)}`,
    chainName: 'Cronos Mainnet',
    nativeCurrency: {
      name: 'Cronos',
      symbol: 'CRO',
      decimals: 18,
    },
    rpcUrls: ['https://evm.cronos.org'],
    blockExplorerUrls: ['https://cronoscan.com'],
  },
}

export const NETWORK_LABLES = {
  [ChainId.ETHEREUM]: 'eth',
  [ChainId.BSC_MAINNET]: 'bsc',
  [ChainId.FANTOM]: 'ftm',
  [ChainId.MATIC]: 'matic',
  [ChainId.AVALANCHE]: 'avax',
  [ChainId.CRONOS]: 'cro',
}

export const EXPLORER_URLS = {
  [ChainId.ETHEREUM]: 'etherscan.io',
  [ChainId.BSC_MAINNET]: 'bscscan.com',
  [ChainId.FANTOM]: 'ftmscan.com',
  [ChainId.MATIC]: 'polygonscan.com',
  [ChainId.AVALANCHE]: 'snowtrace.io',
  [ChainId.CRONOS]: 'cronoscan.com',
}

export const COINGECKO_ID = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.BSC_MAINNET]: 'binancecoin',
  [ChainId.FANTOM]: 'fantom',
  [ChainId.MATIC]: 'matic-network',
  [ChainId.AVALANCHE]: 'avalanche-2',
  [ChainId.CRONOS]: 'cronos',
}
