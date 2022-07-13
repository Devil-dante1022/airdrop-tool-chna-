import { Circle } from 'react-feather';
import Bsc from '../../components/icons/Bsc';
import Ethereum from '../../components/icons/Ethereum';
import Fantom from '../../components/icons/Fantom';
import Polygon from '../../components/icons/Polygon';
import Avalanche from '../../components/icons/Avalanche';
import Cronos from '../../components/icons/Cronos';

export default [
  {
    id: 'tokenMultiSend',
    title: 'Token MultiSend Tool',
    children: [
      {
        id: '56',
        title: 'BSC',
        icon: <Circle size={20} />,
        chainIcon: <Bsc />,
        navLink: '/bsc',
      },
      {
        id: '1',
        title: 'ETHEREUM',
        icon: <Circle size={20} />,
        chainIcon: <Ethereum />,
        navLink: '/eth',
      },
      {
        id: '250',
        title: 'FANTOM',
        icon: <Circle size={20} />,
        chainIcon: <Fantom />,
        navLink: '/ftm',
      },
      {
        id: '137',
        title: 'MATIC',
        icon: <Circle size={20} />,
        chainIcon: <Polygon />,
        navLink: '/matic',
      },
      {
        id: '43114',
        title: 'AVALANCHE',
        icon: <Circle size={20} />,
        chainIcon: <Avalanche />,
        navLink: '/avax',
      },
      {
        id: '25',
        title: 'CRONOS',
        icon: <Circle size={20} />,
        chainIcon: <Cronos />,
        navLink: '/cro',
      },
    ],
  },
];
