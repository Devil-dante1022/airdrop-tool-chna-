// Set of helper functions to facilitate wallet setup

import { ExplorerUrls } from '../configs/constants'
import { nodes } from './getRpcUrl'
import { NETWORKS, DEFAULT_CHAIN_ID } from '../configs/constants/network'

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (chainId) => {
  const provider = window.ethereum
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [NETWORKS[chainId ?? DEFAULT_CHAIN_ID],],
      })
      return undefined
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return `Failed to add ${NETWORKS[chainId ?? DEFAULT_CHAIN_ID].chainName}. Please add the blockchain on your wallet directly`
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return `Please add ${NETWORKS[chainId ?? DEFAULT_CHAIN_ID].chainName} on your connected wallet and try again`;
  }
}

export const switchChain = async (chainId) => {
  const provider = window.ethereum
  if (provider) {
    try {
      await provider.request({
        "id": 1,
        "jsonrpc": "2.0",
        "method": "wallet_switchEthereumChain",
        "params": [
          {
            chainId: `0x${chainId.toString(16)}`,
          }
        ]
      })
      return undefined
    } catch (error) {
      if (error.code === 4902) {
        const result = await setupNetwork(chainId)
        return result
      }

      console.error('Failed to switch the network in Metamask:', error)
      if (error?.message?.indexOf('wallet_switchEthereumChain') > 0) {
        return `Failed to switch networks from the Brewlabs Platform. In order to use ${NETWORKS[chainId ?? DEFAULT_CHAIN_ID].chainName}, you must change the blockchain of your wallet directly.`
      }
      return error?.message
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return `In order to use ${NETWORKS[chainId ?? DEFAULT_CHAIN_ID].chainName}, Please try again after disconnect wallet and switch the blockchain on your connected wallet directly.`;
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage,
) => {
  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  })

  return tokenAdded
}

// Check if the metamask is installed
export const _isMetaMaskInstalled = () => {
  //Have to check the ethereum binding on the window object to see if it's installed
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};