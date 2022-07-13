import { useMemo } from 'react'
import { useActiveWeb3React } from './index'
import AirdropAbi from '../configs/abi/airdrop.json'
import erc20ABI from '../config/abi/erc20.json'
import { getAirdropAddress } from '../utils/addressHelpers'
import { getContract } from '../utils/contractHelpers'

// returns null on errors
function useContract(address, ABI) {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library.getSigner())
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, account])
}

export function useAirdropContract() {
  const { chainId } = useActiveWeb3React()
  return useContract(getAirdropAddress(chainId), AirdropAbi)
}

export function useTokenContract(tokenAddress) {
  return useContract(tokenAddress, erc20ABI)
}
