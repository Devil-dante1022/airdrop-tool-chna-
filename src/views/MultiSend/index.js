import { useLocation } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
  Button,
  ButtonGroup,
} from 'reactstrap';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import { handleTokenType } from '@store/actions/layout'

import { useActiveWeb3React } from '../../hooks';
import { getAirdropAddress } from '../../utils/addressHelpers';
import { getExplorerLink } from '../../utils/helper';

import WizardHorizontal from './wizard';
import AlertInfo from './Alerts/AlertInfo';
import { NETWORK_LABLES } from '../../configs/constants/network';
import { TOKEN } from '../../configs/constants';

const Home = () => {

  // ** URL Vars
  const location = useLocation()
  const currentURL = location.pathname
  const chainId = Object.keys(NETWORK_LABLES).find((label) => NETWORK_LABLES[label] === currentURL.slice(1))

  // ** Store Vars
  const dispatch = useDispatch()
  const layoutStore = useSelector(state => state.layout)

  // ** Vars
  const tokenType = layoutStore.tokenType

  // ** Update Token Type
  const setTokenType = val => dispatch(handleTokenType(val))

  return (
    <div>
      <Card marginBottom='1.5rem'>
        <CardBody>
          <div className='card-text'>
            <p>
              This decentralised airdrop tool has been developed by the team at{' '}
              <a
                href='https://www.brewlabs.tools/'
                target='_blank'
                className="whitespace-nowrap font-bold text-amber-400 hover:text-yellow-600"
                rel='noopener noreferrer'
              >
                Brewlabs
              </a>
              . Please be sure to read the instructions whilst using the tool.
            </p>

            <p>There are 3 easy steps to complete your desired airdrop!</p>

            <p>
              This Brewlabs airdrop tool will allow you to bulk send tokens in a
              simple step by step transaction. Be sure to follow the
              instructions.
            </p>

            <p>
              {' '}
              If you have any questions reach out to us via{' '}
              <a
                href='https://t.me/brewlabs'
                target='_blank'
                className="whitespace-nowrap font-bold text-amber-400 hover:text-yellow-600"
                rel='noopener noreferrer'
              >
                Telegram
              </a>
            </p>

            <p>Thanks for using Brewlabs!</p>
          </div>
        </CardBody>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <ButtonGroup>
          <Button
            color={tokenType === TOKEN.ERC20 ? 'primary' : 'secondary'}
            outline={tokenType !== TOKEN.ERC20}
            size='lg'
            onClick={() => setTokenType(TOKEN.ERC20)}>
            Token Airdrop
          </Button>
          <Button
            color={tokenType === TOKEN.ERC721 ? 'primary' : 'secondary'}
            outline={tokenType !== TOKEN.ERC721}
            size='lg'
            onClick={() => setTokenType(TOKEN.ERC721)}>
            NFT Airdrop
          </Button>
        </ButtonGroup>
      </div>

      {!tokenType ? <Card>
        <CardBody style={{ display: 'flex', justifyContent: 'center' }}>
          <AlertInfo
            message="Important message to airdrop tool users: To maximise your airdrop efficiency, please whitelist the airdrop contract address below. Please whitelist by calling excludeFee, excludeMaxTransaction, excludeMaxWallet and activateTradingWhileDisabled on your token smart contract where applicable."
            linkText="Contract address"
            externalLink={getExplorerLink(Number(chainId))} />
        </CardBody>
      </Card> : null}

      <WizardHorizontal />
    </div>
  );
};

export default Home;
