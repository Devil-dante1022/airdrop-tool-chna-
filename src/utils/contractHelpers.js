import { ethers } from "ethers"
import MulticallABI from '../configs/abi/Multicall.json';
import ERC20ABI from '../configs/abi/erc20.json';
import ERC721ABI from '../configs/abi/erc721.json';
import AirdropAbi from '../configs/abi/airdrop.json';
import DividendTrackerABI from '../configs/abi/dividendTracker.json';

import { getMulticallAddress, getAirdropAddress } from "./addressHelpers";

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_NODE_1)

export const getContract = (address, abi, signer) => {
  const signerOrProvider = signer ? signer : simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider)
}

export const getMulticallContract = (provider, chainId) => {
  return getContract(getMulticallAddress(chainId), MulticallABI, provider)
}

export const getAirdropContract = (provider, chainId) => {
  return getContract(
    getAirdropAddress(chainId),
    AirdropAbi,
    provider
  );
};

export const getTokenContract = (currency, provider) => {
  return getContract(
    currency,
    ERC20ABI,
    provider
  )
}

export const getERC721TokenContract = (collection, provider) => {
  return getContract(
    collection,
    ERC721ABI,
    provider
  )
}

export const getDividendTracker = (currency, provider) => {
  return getContract(
    currency,
    DividendTrackerABI,
    provider
  )
}
