import { UnsupportedChainIdError, useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { injected } from '../utils/web3React'
import useAuth from './useAuth'

export const NetworkContextName = 'NftologyNFTNetwork'
export const connectorLocalStorageKey = "NftologyNFTConnectorId"

export function useActiveWeb3React() {
  const context = useWeb3ReactCore()
  return context
}

const _binanceChainListener = async () =>
  new Promise((resolve) =>
    Object.defineProperty(window, 'BinanceChain', {
      get() {
        return this.bsc
      },
      set(bsc) {
        this.bsc = bsc

        resolve()
      },
    }),
  )

export function useEagerConnect() {
  const [tried, setTried] = useState(false)
  const { login } = useAuth()

  useEffect(() => {
    const connectorId = window.localStorage.getItem(connectorLocalStorageKey)

    if (connectorId) {
      const isConnectorBinanceChain = connectorId === 'BinanceChainWallet'
      const isBinanceChainDefined = Reflect.has(window, 'BinanceChain')

      // Currently BSC extension doesn't always inject in time.
      // We must check to see if it exists, and if not, wait for it before proceeding.
      if (isConnectorBinanceChain && !isBinanceChainDefined) {
        _binanceChainListener().then(() => {
          login(connectorId)
          setTried(true)
        })

        return
      }

      login(connectorId)
      setTried(true)
    }
  }, [login])
    
  return tried
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((e) => {
          console.error('Failed to activate after chain changed', e)
        })
      }

      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((e) => {
            console.error('Failed to activate after accounts changed', e)
          })
        }
      }

      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate])
}
