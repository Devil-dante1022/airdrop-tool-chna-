import { useRef, useState } from 'react';
import { Card } from 'reactstrap';
import Wizard from '@components/wizard';

import Prepare from './steps/Prepare';
import Confirm from './steps/Confirm';
import Send from './steps/Send';

const MultiSendWizard = () => {
  const [stepper, setStepper] = useState(null);
  const ref = useRef(null);

  const [token, setToken] = useState('');
  const [airdrops, setAirdrops] = useState([]);

  const limit = 5;
  const [bSameAmount, setbSameAmount] = useState(false);
  const [amount, setAmount] = useState('');
  const [succeedTxs, setSucceedTxs] = useState([]);
  const [step, setStep] = useState(0);

  const pageData = {
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
    succeedTxs,
    setSucceedTxs,
    limit,
  };

  const steps = [
    {
      id: 'prepare',
      title: 'Prepare',
      subtitle: 'Enter details.',
      content: (
        <Prepare stepper={stepper} type='wizard-horizontal' data={pageData} />
      ),
    },
    {
      id: 'confirm',
      title: 'Confirm',
      subtitle: 'Check balances & airdrops',
      content: (
        <Confirm stepper={stepper} type='wizard-horizontal' data={pageData} />
      ),
    },
    {
      id: 'send',
      title: 'Send',
      subtitle: 'Send tokens',
      content: (
        <Send stepper={stepper} type='wizard-horizontal' data={pageData} />
      ),
    },
  ];

  return (
    <Card className='horizontal-wizard'>
      <div className='misc-wrapper ml-auto mr-auto'>
        <Wizard instance={(el) => setStepper(el)} ref={ref} steps={steps} />
      </div>
    </Card>
  );
};

export default MultiSendWizard;
