import React from "react"
import { Row, Modal, ModalHeader, ModalBody, Button, CardBody } from 'reactstrap';
import QRCode from "react-qr-code";
import { connectorLocalStorageKey } from '../../hooks';
import { shortenHex } from "../../utils/helper";


export default function AccountModal({ open, account, logout, onDismiss = () => null }) {
    return (
        <Modal
            isOpen={open} 
            toggle={onDismiss}
            className='modal-dialog-centered modal-sm'
        >
            <ModalHeader toggle={onDismiss}>Account</ModalHeader>
            <ModalBody>
                <CardBody>
                    { account && 
                        <div className="mb-1 text-center">
                            <div className="inline-block mx-auto p-1 bg-light">
                            <QRCode
                                value={account}
                                size={200}
                            />
                            </div>
                            <h5 className="mt-1">{shortenHex(`${account}`, 10)}</h5>
                        </div>
                    }
                    
                    <div className="text-center">
                        <Button.Ripple
                            onClick={() => {
                                logout();
                                window.localStorage.removeItem(connectorLocalStorageKey);
                                onDismiss();
                            }}
                            color="danger"
                        >Logout</Button.Ripple>
                    </div>
                </CardBody>
            </ModalBody>
        </Modal>

    )
}
