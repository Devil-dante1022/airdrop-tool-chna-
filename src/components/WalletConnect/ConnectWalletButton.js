import { UnsupportedChainIdError } from "@web3-react/core"
import React, { useState } from "react"
import { Button } from 'reactstrap'
import { useActiveWeb3React } from '../../hooks'
import useAuth from '../../hooks/useAuth'
import AccountModal from './AccountModal'
import ConnectModal from './ConnectModal'
import wrongNetworkIcon from '@src/assets/images/wrong/brewlabs-wrong-network-button-red.svg';

export default function ConnectWalletButton(props) {
    const { account, error } = useActiveWeb3React()
    const { login, logout } = useAuth()
    const [connectModalOpen, setConnectModalOpen] = useState(false)
    const [accountModalOpen, setAccountModalOpen] = useState(false)

    const shortAddress = account ? `${account.slice(0, 6)}...${account.slice(-6)}` : null
    const onClickConnect = () => {
        if (account) {
            setAccountModalOpen(true);
        } else {
            setConnectModalOpen(true)
        }
    }

    if (error instanceof UnsupportedChainIdError) {
        return <img src={wrongNetworkIcon} width='180' alt='Wrong Network' />
    }
    return (
        <>
            <Button.Ripple color="primary" onClick={() => onClickConnect()} {...props} className="round" outline>
                {props.isheader ? 'Connect Wallet' : account ? shortAddress : 'Connect Wallet'}
            </Button.Ripple>
            <ConnectModal open={connectModalOpen} login={login} onDismiss={() => setConnectModalOpen(false)} />
            <AccountModal open={accountModalOpen} logout={logout} account={account} onDismiss={() => setAccountModalOpen(false)} />
        </>
    )
}
