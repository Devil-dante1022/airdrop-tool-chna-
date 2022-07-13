import React from "react"
import { Row, Modal, ModalHeader, ModalBody, Button, CardBody } from 'reactstrap';
import { connectorLocalStorageKey } from '../../hooks';
import { connectors } from '../../utils/web3React';


export default function ConnectModal({ open, login, onDismiss = () => null }) {
    return (
        <Modal 
            isOpen={open} 
            toggle={onDismiss}
            className='modal-dialog-centered modal-sm'
        >
            <ModalHeader toggle={onDismiss}>Connect Wallet</ModalHeader>
            <ModalBody>
                <CardBody>
                    {connectors.map((entry, index) => (
                        <Button.Ripple
                            style={{width: "100%"}}
                            key={index}
                            auto
                            className="mb-1"
                            color="primary"
                            outline
                            onClick={() => {
                                login(entry.connectorId);
                                window.localStorage.setItem(connectorLocalStorageKey, entry.connectorId);
                                onDismiss()
                            }}
                            id={`wallet-connect-${entry.title.toLocaleLowerCase()}`}
                        >
                            <Row className="align-items-center justify-content-between pl-2 pr-2">
                                <div>
                                    {entry.title}
                                </div>
                                <div>
                                    <entry.icon width="30"/>
                                </div>
                            </Row>
                        </Button.Ripple>
                    ))}
                </CardBody>
            </ModalBody>
        </Modal>
    )
}
