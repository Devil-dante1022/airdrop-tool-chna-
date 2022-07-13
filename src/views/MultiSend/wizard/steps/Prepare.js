import { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Alert,
  Form,
  Label,
  Input,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Button,
  Tooltip,
  UncontrolledTooltip
} from 'reactstrap';
import * as React from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import classnames from 'classnames';
import { ethers } from 'ethers';
import Papa from 'papaparse';
import { InformationCircleIcon } from '@heroicons/react/solid'

import { isObjEmpty } from '@utils';
import { useActiveWeb3React } from '../../../../hooks';
import { getDividendTracker, getERC721TokenContract, getTokenContract } from '../../../../utils/contractHelpers';
import { getAirdropAddress } from '../../../../utils/addressHelpers';
import { TOKEN } from '../../../../configs/constants';
import '../../../../assets/scss/style.scss'

const Prepare = ({ stepper, type, data }) => {
  const { account, library, chainId } = useActiveWeb3React();
  const { register, errors, handleSubmit, trigger } = useForm();
  const [isHover,setIsHover] = useState(false);

  const {
    step,
    setStep,
    token,
    setToken,
    airdrops,
    setAirdrops,
    bSameAmount,
    setbSameAmount,
    amount,
    setAmount,
  } = data;
  const [validationErrors, setValidationErrors] = useState([]);

  const [airdropDetail, setAirdropDetail] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const [hasDividendTracker, setHasDividendTracker] = useState(false);

  // ** Vars
  const layoutStore = useSelector(state => state.layout)
  const tokenType = layoutStore.tokenType

  const onSubmit = async () => {
    trigger();

    if (!account) {
      toast.error('Please connect a wallet');
      return;
    }

    if (!ethers.utils.isAddress(token)) {
      toast.error('Token address is invalid');
      return;
    }

    const tokenContract = tokenType === TOKEN.ERC20 ? getTokenContract(token, library.getSigner()) : getERC721TokenContract(token, library.getSigner());
    try {
      tokenType === TOKEN.ERC20 ? await tokenContract.decimals() : await tokenContract.isApprovedForAll(account, getAirdropAddress(chainId));
    } catch (e) {
      toast.error('Provided address is not token');
      return;
    }

    if (isObjEmpty(errors)) {
      if (validationErrors.length > 0) {
        toast.error('Please fix validation issues');
        return;
      }

      stepper.next();
      setStep(step + 1);
    }
  };

  const updateData = (result) => {
    const data = result.data;
    for (let i = 0; i < data?.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        data[i][j] = data[i][j].trim();
      }
    }
    setAirdrops(data);

    const err = [];
    let txt = '';
    for (let i = 0; i < data?.length; i++) {
      const record = data[i];
      txt += `${txt === '' ? '' : '\n'}${record.join(',')}`;

      if (record.length > 2) {
        err.push(
          `Line ${i + 1}: ${record[0]
          } is a invalid wallet address and wrong amount. E.g:address,number`
        );
        continue;
      }

      if (!ethers.utils.isAddress(record[0])) {
        err.push(`Line ${i + 1}: ${record[0]} is a invalid wallet address`);
      }

      if (record[1] === undefined) continue;
      if (!record[1] || isNaN(record[1]) || +record[1] <= 0) {
        err.push(`Line ${i + 1}: ${record[1]} is a invalid wrong amount`);
      }
    }

    setAirdropDetail(txt);
    setValidationErrors(err);
  };

  const importCSV = (csvfile) => {
    Papa.parse(csvfile, {
      complete: updateData,
      header: false,
    });
  };

  function handleFile(event) {
    const file = event.target.files[0];
    const { type } = file;

    if (type !== 'application/vnd.ms-excel' && type !== 'text/csv') {
      toast.error('You can import only csv file');
      return;
    }

    importCSV(file);
  }

  const airdropDetailChanged = (e) => {
    const value = e.target.value;
    const list = value !== '' ? value.split('\n') : [];

    let isSame = true;
    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].split(',');

      if (i > 0) {
        if (list[i][1] !== list[i - 1][1]) isSame = false;
      }
    }

    setbSameAmount(isSame);
    updateData({ data: list });
  };

  const setSameAmount = () => {
    const data = [];
    for (let i = 0; i < airdrops.length; i++) {
      data.push([airdrops[i][0], amount]);
    }
    updateData({ data });

    setVisibleModal(false);
    setbSameAmount(true);
  };

  useEffect(() => {
    if (stepper && chainId) {
      stepper.to(0)
      setStep(0)
    }
  }, [chainId, tokenType])

  useEffect(() => {
    const update = async (token) => {
      const tokenContract = getDividendTracker(token, library.getSigner())
      try {
        await tokenContract.dividendTracker()
        setHasDividendTracker(true)
      } catch (err) {
        setHasDividendTracker(false)
      }
    }
    if (ethers.utils.isAddress(token)) {
      update(token)
    } else {
      setHasDividendTracker(false)
    }
  }, [token, account])
  console.log("isHover:::",isHover);
  return (
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup tag={Col}>
          <Label className='form-label' for={`token-${type}`}>
            Token
          </Label>
          <div style={{ position: 'relative' }}
           >
            
            <Input
              name={`token-${type}`}
              id={`token-${type}`}
              placeholder='0x111111111111...'
              innerRef={register({ required: true })}
              className={!isHover ?`${classnames({ 'is-invalid': errors[`token-${type}`] })}` : "input-outline-hover"}
              // className={!isHover ? "input-outline-not-hover" : "input-outline-hover"}
              // className={classnames({ 'is-dividendTracker': true })}
              autoComplete='off'
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            {hasDividendTracker ? <div><InformationCircleIcon onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}  className="h-5 w-5 text-gray-50" aria-hidden="true" style={{ position: 'absolute', top: '10', right: '10' }} id='ToolTip' /><UncontrolledTooltip flip target='ToolTip'>This token contract contains a dividend tracker. Please note that token contracts that use dividend trackers are limited to 40 wallet airdrops at a time.</UncontrolledTooltip></div> : null}
          </div>
        </FormGroup>
        <FormGroup tag={Col}>
          <Label className='form-label d-flex' for={`email-${type}`}>
            <div>
              Addresses with Amounts
            </div>
            <div
              className='ml-auto btn-upload'
              onClick={() => setVisibleModal(true)}
            >
              Auto add amounts
            </div>
            <div
              className='ml-auto btn-upload'
              onClick={() => {
                document.getElementById('file').click();
              }}
            >
              Upload
            </div>
            <input
              type='file'
              onChange={handleFile}
              hidden
              accept='.csv'
              id='file'
            />
          </Label>
          <Input
            type='textarea'
            name={`detail-${type}`}
            id={`detail-${type}`}
            rows='10'
            placeholder='Insert address and amount, seperate with comma "0xxxxxxxxxx,2000 etc"'
            innerRef={register({ required: true })}
            className={classnames({ 'is-invalid': errors[`detail-${type}`] })}
            value={airdropDetail}
            onChange={airdropDetailChanged}
          />
        </FormGroup>

        <Alert
          color='danger'
          className='p-1 text-secondary'
          isOpen={validationErrors.length > 0}
        >
          {validationErrors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>

        <div className='d-flex justify-content-between'>
          <Button.Ripple
            color='secondary'
            className='btn-prev'
            outline
            disabled
          >
            <ArrowLeft
              size={14}
              className='align-middle mr-sm-25 mr-0'
            ></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>
              Previous
            </span>
          </Button.Ripple>
          <Button.Ripple type='submit' color='primary' className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>Next</span>
            <ArrowRight
              size={14}
              className='align-middle ml-sm-25 ml-0'
            ></ArrowRight>
          </Button.Ripple>
        </div>
      </Form>
      <Modal
        isOpen={visibleModal}
        className='modal-dialog-centered modal-sm'
        toggle={() => setVisibleModal(false)}
      >
        <ModalHeader toggle={() => setVisibleModal(false)}>
          Amount can be automatically added after each address
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for='basicInput'>Auto add amounts</Label>
            <Input
              type='text'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={setSameAmount}>
            Accept
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default Prepare;
