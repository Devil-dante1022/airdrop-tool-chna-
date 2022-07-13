import { Fragment, useEffect, useState } from 'react';
import {
  Alert,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  Form,
  Input,
  Spinner,
  Badge,
} from 'reactstrap';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'react-feather';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import { useActiveWeb3React } from '../../../../hooks';
import { getAirdropAddress } from '../../../../utils/addressHelpers';
import {
  getAirdropContract,
  getTokenContract,
} from '../../../../utils/contractHelpers';
import { useRouteMatch } from 'react-router-dom';

const Send = ({ stepper, type, data }) => {
  const { account, library, chainId } = useActiveWeb3React();
  const { register, errors, handleSubmit, trigger } = useForm();
  const [active, setActive] = useState('1');

  const { step, setStep, token, airdrops, bSameAmount, amount } = data;

  const [isProcessing, setProcessing] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const [buttonTxt, setButtonTxt] = useState('Processing');

  const [waitingList, setWaitingList] = useState([]);
  const [failedList, setFailedList] = useState([]);
  const [succeedList, setSucceedList] = useState([]);

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  const processSend = async (data) => {
    if (isFinished) return;
    if (data.length === 0) {
      toast.error('Empty airdrop');
      return;
    }

    toggle('1');

    setFinished(false);
    setProcessing(true);

    setWaitingList(data);
    setFailedList([]);

    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += +data[i][1];
    }

    const airdropContract = getAirdropContract(library.getSigner(), chainId);
    const tokenContract = getTokenContract(token, library.getSigner());

    const decimals = await tokenContract.decimals();
    const allowance = await tokenContract.allowance(
      account,
      getAirdropAddress(chainId)
    );

    if (
      new BigNumber(ethers.utils.formatUnits(allowance, decimals)).lt(total)
    ) {
      setButtonTxt('Approving tokens');
      try {
        const tx = await tokenContract.approve(
          getAirdropAddress(chainId),
          ethers.constants.MaxInt256
        );
        const receipt = await tx.wait();
        if (receipt.status) {
          toast.success('Token was approved');
        } else {
          toast.error('Please try again');
          setButtonTxt('Approve token');
          setProcessing(false);
          return;
        }
      } catch (e) {
        toast.error(e['message']);
        setButtonTxt('Approve & Send');
        setProcessing(false);
        return;
      }
    }

    let limit = 200

    try {
      limit = await airdropContract.maxTxLimit();
    } catch (e) {
      console.log('error', e)
    }

    setButtonTxt('Sending tokens');

    let tmpList = data;
    const failed = [];
    setFailedList([]);
    while (tmpList.length > 0) {
      const addresses = [];
      const amounts = [];
      const processingList = [];

      for (let i = 0; i < tmpList.length; i++) {
        addresses.push(tmpList[i][0]);
        amounts.push(
          ethers.utils
            .parseUnits(parseFloat(tmpList[i][1]).toFixed(decimals), decimals)
            .toString()
        );
        processingList.push(tmpList[i]);

        if (i + 1 >= limit || i === tmpList.length - 1) {
          try {
            const commission = await airdropContract.estimateServiceFee(
              token,
              i + 1
            );
            let tx;
            if (bSameAmount) {
              const gasLimit =
                await airdropContract.estimateGas.multiTransfer_fixed(
                  token,
                  addresses,
                  amounts[0],
                  { value: commission }
                );
              tx = await airdropContract.multiTransfer_fixed(
                token,
                addresses,
                amounts[0],
                { value: commission, gasLimit }
              );
            } else {
              const gasLimit = await airdropContract.estimateGas.multiTransfer(
                token,
                addresses,
                amounts,
                { value: commission }
              );
              tx = await airdropContract.multiTransfer(
                token,
                addresses,
                amounts,
                { value: commission, gasLimit }
              );
            }

            const receipt = await tx.wait();

            if (receipt.status) {
              setSucceedList([...succeedList, ...processingList]);
            } else {
              failed.push(...processingList);
              setFailedList(failed);
            }
          } catch (e) {
            console.log('error', e)
            toast.error(e['message']);

            failed.push(...processingList);
            setFailedList(failed);
          }

          tmpList = tmpList.filter(
            (a) => !processingList.map((b) => b[0]).includes(a[0])
          );
          setWaitingList(tmpList);

          break;
        }
      }
    }

    if (failed.length > 0) {
      setButtonTxt('Continue for failed transactions');
      toggle('3');
    } else {
      setButtonTxt('New');
      setFinished(true);

      toast.success('Sent tokens successfully');
      toggle('2');
    }
    setProcessing(false);
  };

  useEffect(() => {
    if (step === 2) {
      setFinished(false);
      setSucceedList([]);

      processSend(airdrops);
    }
  }, [airdrops, token, bSameAmount, amount, step]);

  const handleContinue = () => {
    if (isFinished) {
      window.location.reload();
    }

    if (failedList.length > 0) {
      processSend(failedList);
    } else {
      processSend(airdrops);
    }
  };

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>
          A total of 1 needs to be sent, you need to send 1 more times
        </h5>
      </div>

      <Alert
        color='primary'
        className='p-1 text-secondary'
        isOpen={isProcessing}
      >
        <div className='d-flex align-items-center'>
          <Spinner color='primary' />
          <div className='ml-1'>Processing to send tokens</div>
        </div>
      </Alert>

      <Nav tabs style={{ marginTop: '10px' }}>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1');
            }}
          >
            Waiting List
            {waitingList.length > 0 && (
              <Badge className='badge-sm badge-up' color='primary' pill>
                {waitingList.length}
              </Badge>
            )}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2');
            }}
          >
            Send Success List
            {succeedList.length > 0 && (
              <Badge className='badge-sm badge-up' color='success' pill>
                {succeedList.length}
              </Badge>
            )}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3');
            }}
          >
            Send Failure List
            {failedList.length > 0 && (
              <Badge className='badge-sm badge-up' color='danger' pill>
                {failedList.length}
              </Badge>
            )}
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className='py-50' activeTab={active}>
        <TabPane tabId='1'>
          <Input
            type='textarea'
            rows='10'
            readOnly
            value={waitingList.map((a) => a.join(',')).join('\n')}
          />
        </TabPane>
        <TabPane tabId='2'>
          <Input
            type='textarea'
            rows='10'
            readOnly
            value={succeedList.map((a) => a.join(',')).join('\n')}
          />
        </TabPane>
        <TabPane tabId='3'>
          <Input
            type='textarea'
            rows='10'
            readOnly
            value={failedList.map((a) => a.join(',')).join('\n')}
          />
        </TabPane>
      </TabContent>
      <Form onSubmit={() => { }}>
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
          {!isProcessing && (
            <Button.Ripple
              type='submit'
              color='primary'
              className='btn-next'
              onClick={handleContinue}
            >
              <span className='align-middle d-sm-inline-block d-none'>
                {buttonTxt}
              </span>
            </Button.Ripple>
          )}
        </div>
      </Form>
    </Fragment>
  );
};

export default Send;
