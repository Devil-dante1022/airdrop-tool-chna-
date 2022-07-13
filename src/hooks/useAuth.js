import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'

import { connectorLocalStorageKey } from '.'
import { connectorsByName } from '../utils/web3React'
import { setupNetwork } from '../utils/wallet'

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()

  const login = useCallback((connectorID) => {
    console.log('attempt login using ', connectorID)
    const connector = connectorsByName[connectorID]
    if (connector) {
      activate(connector, async (error) => {
        window.localStorage.removeItem(connectorLocalStorageKey)
        if (error instanceof UnsupportedChainIdError) {
          console.log({ text: 'Unsupported Chain Id Error. Check your chain Id!', type: 'error' })
          const hasSetup = await setupNetwork()
          if (hasSetup) {
            activate(connector)
          }
        } else if (error instanceof NoEthereumProviderError ) {
          console.log({ text: 'No provider was found!', type: 'error' })
        } else if (
          error instanceof UserRejectedRequestErrorInjected ||
          error instanceof UserRejectedRequestErrorWalletConnect
        ) {
          if (connector instanceof WalletConnectConnector) {
            const walletConnector = connector
            walletConnector.walletConnectProvider = null
          }
          console.log({ text: 'Authorization Error, Please authorize to access your account', type: 'error' })
          console.log('Authorization Error, Please authorize to access your account')
        } else {
          
          console.log({ text: error.message, type: 'error' })
          console.log(error.name, error.message)
        }
      })
    } else {
      console.log({ text: "Can't find connector, The connector config is wrong", type: 'error' })
      console.log("Can't find connector", 'The connector config is wrong')
    }
  }, [activate])

  const logout = useCallback(() => {
    deactivate()
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName.WalletConnect.close()
      connectorsByName.WalletConnect.walletConnectProvider = null
    }
  }, [deactivate])

  return { login, logout }
}

export default useAuth
