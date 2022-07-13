export const zeroAddress = '0x0000000000000000000000000000000000000000'

export const DefaultChainID = parseInt(process.env.REACT_APP_NETWORK_ID, 10)
export const supportedChainIds = [1, 56, 137, 250, 43114, 25]

export const ChainList = {
  56: 'BSC mainnet',
  97: 'BSC Testnet',
}

export const ExplorerUrls = {
  56: 'https://bscscan.com/',
  97: 'https://testnet.bscscan.com/',
}

export const Currencies = {
  56: [
    {
      id: 'binancecoin',
      name: 'BNB',
      address: zeroAddress,
      symbol: 'BNB',
      chainId: 56,
      decimals: 18,
      icon: ''
    },
  ],
}

export const TOKEN = {
  ERC20: 0,
  ERC721: 1
}