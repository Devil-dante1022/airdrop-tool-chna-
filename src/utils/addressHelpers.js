import addresses from '../configs/constants/contracts'

export const getAddress = (address, chainId) => {
  return address[chainId] ? address[chainId] : address[56]
}

export const getMulticallAddress = (chainId) => {
  return getAddress(addresses.multiCall, chainId)
}

export const getAirdropAddress = (chainId) => {
  return getAddress(addresses.airdrop, chainId)
}