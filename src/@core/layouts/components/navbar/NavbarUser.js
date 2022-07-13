// ** Dropdowns Imports
import { Fragment } from 'react';

// import UserDropdown from './UserDropdown';

// ** Third Party Components
import { Sun, Moon, Menu } from 'react-feather';
import { NavItem, NavLink } from 'reactstrap';
import { useActiveWeb3React } from '@src/hooks';
import ConnectWalletButton from '@src/components/WalletConnect/ConnectWalletButton';

import brewlabsLogo from '@src/assets/images/logo/brewlabs-logo.svg';

const NavbarUser = (props) => {
  // Props
  const { skin, setSkin, setMenuVisibility } = props;

  const { account } = useActiveWeb3React();

  return (
    <>
      <img className='logo' src={brewlabsLogo} width='50' alt='Brewlabs logo' />
      <ul className='navbar-nav d-xl-none d-flex align-items-center'>
        <NavItem className='mobile-menu mr-auto'>
          <NavLink
            className='nav-menu-main menu-toggle hidden-xs is-active'
            onClick={() => setMenuVisibility(true)}
          >
            <Menu className='ficon' />
          </NavLink>
        </NavItem>
      </ul>

      <ul className='nav navbar-nav align-items-center ml-auto'>
        <ConnectWalletButton />
      </ul>
    </>
  );
};
export default NavbarUser;
