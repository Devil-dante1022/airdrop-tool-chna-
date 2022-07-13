import { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Row, Button, Form, Table } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight } from 'react-feather';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import { isObjEmpty } from '@utils';
import { useActiveWeb3React } from '../../../../hooks';
import { getAirdropAddress } from '../../../../utils/addressHelpers';
import {
  getAirdropContract,
  getERC721TokenContract,
  getTokenContract,
} from '../../../../utils/contractHelpers';
import { NETWORKS, COINGECKO_ID } from '../../../../configs/constants/network';
import { TOKEN } from '../../../../configs/constants';

const Confirm = ({ stepper, type, data }) => {
  const { account, library, chainId } = useActiveWeb3React();
  const _symbol = NETWORKS[chainId] ? NETWORKS[chainId].nativeCurrency.symbol : 'BNB'

  const { register, errors, handleSubmit, trigger } = useForm();
  const { step, setStep, token, airdrops, setAirdrops, bSameAmount } = data;

  const [symbol, setSymbol] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [bnbBalance, setBnbBalance] = useState('');
  const [allowance, setAllowance] = useState();
  const [allowed, setAllowed] = useState(false);
  const [total, setTotal] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [errs, setErrs] = useState([]);
  const [limit, setLimit] = useState(200)

  const [isProcessing, setProcessing] = useState(false);

  // ** Vars
  const layoutStore = useSelector(state => state.layout)
  const tokenType = layoutStore.tokenType

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        console.log('inERC20')
        setProcessing(true);

        const tokenContract = getTokenContract(token, library?.getSigner());

        setSymbol(await tokenContract.symbol());
        const decimals = await tokenContract.decimals()

        const tBalance = await tokenContract.balanceOf(account);
        const bBalance = await library.getSigner().getBalance();
        const allowance = await tokenContract.allowance(
          account,
          getAirdropAddress(chainId)
        );

        setTokenBalance(ethers.utils.formatUnits(tBalance, decimals));
        setBnbBalance(ethers.utils.formatEther(bBalance));
        setAllowance(ethers.utils.formatEther(allowance));
        setProcessing(false);
      } catch (e) {
        toast.error('Provided address is not token');
      }
    };

    const fetchERC721Balances = async () => {
      try {
        setProcessing(true);

        const tokenContract = getERC721TokenContract(token, library?.getSigner());

        setSymbol(await tokenContract.symbol());

        const tBalance = await tokenContract.balanceOf(account);
        const bBalance = await library.getSigner().getBalance();
        const allowed = await tokenContract.isApprovedForAll(
          account,
          getAirdropAddress(chainId)
        );

        setTokenBalance(tBalance.toString());
        setBnbBalance(ethers.utils.formatEther(bBalance));
        setAllowed(allowed);
        setProcessing(false);
      } catch (e) {
        console.log('yes, error')
        toast.error('Provided address is not token');
      }
    };

    if (account && ethers.utils.isAddress(token) && step === 1) {
      if (tokenType === TOKEN.ERC20) fetchBalances();
      else fetchERC721Balances();
    }
  }, [token, account, library, step, chainId]);

  useEffect(() => {
    const estimate = async () => {
      try {
        const tokenContract = getTokenContract(token, library?.getSigner());
        const decimals = await tokenContract.decimals()

        const airdropContract = getAirdropContract(library?.getSigner(), chainId)

        const txLimit = await airdropContract.maxTxLimit()
        setLimit(txLimit)
        const length = airdrops.length >= txLimit ? txLimit : airdrops.length

        const addresses = [];
        const amounts = [];
        for (let i = 0; i < length; i++) {
          addresses.push(airdrops[i][0]);
          amounts.push(
            ethers.utils
              .parseUnits(parseFloat(airdrops[i][1]).toFixed(decimals), decimals)
              .toString()
          );
        }

        const fee = await airdropContract.estimateServiceFee(token, length)
        const cost = new BigNumber(ethers.utils.formatEther(fee))
        setServiceFee(cost)

        const gasPrice = await library.getGasPrice()
        let gasEstimate
        if (bSameAmount) {
          gasEstimate = await airdropContract.estimateGas.multiTransfer_fixed(
            token,
            addresses,
            amounts[0],
            { value: fee }
          );
        } else {
          gasEstimate = await airdropContract.estimateGas.multiTransfer(
            token,
            addresses,
            amounts,
            { value: fee }
          );
        }

        const totalFee = cost.plus(new BigNumber(ethers.utils.formatEther(gasPrice.mul(gasEstimate))))
        setServiceFee(totalFee);
      } catch (e) {
        // console.log('error', e)
      }
    };

    let t = 0;
    for (let i = 0; i < airdrops.length; i++) {
      t += parseFloat(airdrops[i][1]);
    }
    setTotal(t.toFixed(3));

    if (account && ethers.utils.isAddress(token) && step === 1) estimate();
  }, [airdrops, token, account, library, step, chainId]);

  const handleRemove = (address) => {
    setAirdrops(airdrops.filter((a) => a[0] !== address));
  };

  const onSubmit = () => {
    trigger();

    if (bnbBalance < serviceFee) {
      toast.error(
        `Insufficient ${_symbol} balance, Please have at least ${serviceFee} ${_symbol}`
      );
      return;
    }

    if (tokenBalance < total) {
      toast.error(
        `Insufficient token balance, Please have at least ${total} ${symbol.toUpperCase()}`
      );
      return;
    }

    if (isObjEmpty(errors)) {
      stepper.next();
    }
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className='list'>
          <h3 className='font-weight-bolder'>List of receipts</h3>
          <Table responsive style={{ maxHeight: '220px' }}>
            <thead>
              <tr>
                <th>Address</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {airdrops.map((d, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div>
                          <div className='font-weight-bolder text-info'>
                            {d[0]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center justify-content-between'>
                        <div className='font-weight-bolder'>
                          {d[1]} {symbol.toUpperCase()}
                        </div>
                        <div
                          className='text-danger btn'
                          onClick={() => handleRemove(d[0])}
                        >
                          remove
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>
        <Row className='mt-2 mb-3'>
          <h3 className='font-weight-bolder'>Summary</h3>
          <Table responsive bordered>
            <tbody>
              <tr>
                <td>
                  <div className='d-flex align-items-center'>
                    <div>
                      <div className='font-weight-bolder'>
                        {total} {symbol.toUpperCase()}
                      </div>
                      <div className='font-small-2 text-muted'>
                        Request approve amount
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className='d-flex align-items-center'>
                    <div>
                      <div className='font-weight-bolder'>
                        {(allowance || 0.0) > 10000 ? 'Unlimit' : `${allowance || 0.0} ${symbol.toUpperCase()}`}
                      </div>
                      <div className='font-small-2 text-muted'>
                        Your current allowance
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='d-flex align-items-center'>
                    <div>
                      <div className='font-weight-bolder'>
                        {airdrops.length}
                      </div>
                      <div className='font-small-2 text-muted'>
                        Total number of addresses
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className='d-flex align-items-center'>
                    <div>
                      <div className='font-weight-bolder'>
                        {(+total)?.toFixed(3)} {symbol.toUpperCase()}
                      </div>
                      <div className='font-small-2 text-muted'>
                        Total number of tokens to be sent
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='d-flex align-items-center'>
                    <div>
                      <div className='font-weight-bolder'>
                        {Math.ceil(airdrops.length / (Number(limit)))}
                      </div>
                      <div className='font-small-2 text-muted'>
                        Total number of transactions needed
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className='d-flex align-items-center'>
                    <div>
                      <div className='font-weight-bolder'>
                        {+Number(tokenBalance).toFixed(6)} {symbol.toUpperCase()}
                      </div>
                      <div className='font-small-2 text-muted'>
                        Your token balance
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='d-flex align-items-center'>
                    <div>
                      <div className='font-weight-bolder'>
                        {(+serviceFee)?.toFixed(6)} {_symbol}
                      </div>
                      <div className='font-small-2 text-muted'>
                        Approximate cost per transaction
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className='d-flex align-items-center'>
                    <div>
                      <div className='font-weight-bolder'>
                        {(+bnbBalance)?.toFixed(3)} {_symbol}
                      </div>
                      <div className='font-small-2 text-muted'>
                        Your {_symbol} balnce
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </Row>

        <Alert
          color='danger'
          className='p-1 text-secondary'
          isOpen={
            !!bnbBalance && (Number(bnbBalance) < serviceFee || Number(tokenBalance) < total)
          }
        >
          {Number(bnbBalance) < serviceFee && (
            <div>{`Insufficient ${_symbol} balance, Please have at least ${serviceFee} ${_symbol}`}</div>
          )}
          {Number(tokenBalance) < total && (
            <div>{`Insufficient token balance, Please have at least ${total} ${symbol.toUpperCase()}`}</div>
          )}
        </Alert>
        <div className='d-flex justify-content-between'>
          <Button.Ripple
            color='primary'
            className='btn-prev'
            onClick={() => {
              stepper.previous();
              setStep(step - 1);
            }}
          >
            <ArrowLeft
              size={14}
              className='align-middle mr-sm-25 mr-0'
            ></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>
              Previous
            </span>
          </Button.Ripple>
          <Button.Ripple
            type='submit'
            color='primary'
            className='btn-next'
            disabled={errs.length > 0 && !isProcessing}
            onClick={() => {
              stepper.next();
              setStep(step + 1);
            }}
          >
            <span className='align-middle d-sm-inline-block d-none'>Next</span>
            <ArrowRight
              size={14}
              className='align-middle ml-sm-25 ml-0'
            ></ArrowRight>
          </Button.Ripple>
        </div>
      </Form>
    </Fragment>
  );
};

export default Confirm;
