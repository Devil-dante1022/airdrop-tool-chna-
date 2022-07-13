// ** React Imports
import { useEffect } from 'react'
import { NavLink, useLocation, matchPath, useParams, useHistory } from 'react-router-dom'

// ** Third Party Components
import { Badge } from 'reactstrap'
import classnames from 'classnames'

// ** Vertical Menu Array Of Items
import navigation from '@src/navigation/vertical'

// ** Utils
import { isNavLinkActive, search, getAllParents } from '@layouts/utils'
import { switchChain } from '../../../../../utils/wallet'
import { useActiveWeb3React } from '../../../../../hooks'
import { ChainId, NETWORK_LABLES } from '../../../../../configs/constants/network'
import { supportedChainIds } from '../../../../../configs/constants'

const COLOR = {
  [ChainId.ETHEREUM]: '#B755E1',
  [ChainId.BSC_MAINNET]: '#ffde00',
  [ChainId.FANTOM]: '#004FFF',
  [ChainId.MATIC]: '#753E9F',
  [ChainId.AVALANCHE]: '#E22349',
  [ChainId.CRONOS]: '#23b6e2',
}

const VerticalNavMenuLink = ({
  item,
  groupActive,
  setGroupActive,
  activeItem,
  setActiveItem,
  groupOpen,
  setGroupOpen,
  toggleActiveGroup,
  parentItem,
  routerProps,
  currentActiveItem
}) => {
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink

  // ** URL Vars
  const location = useLocation()
  const currentURL = location.pathname

  // ** To match path
  const match = matchPath(currentURL, {
    path: `${item.navLink}/:param`,
    exact: true,
    strict: false
  })

  const history = useHistory()
  const { chainId } = useActiveWeb3React()

  // ** Search for current item parents
  const searchParents = (navigation, currentURL) => {
    const parents = search(navigation, currentURL, routerProps) // Search for parent object
    const allParents = getAllParents(parents, 'id') // Parents Object to Parents Array
    return allParents
  }

  // ** URL Vars
  const resetActiveGroup = navLink => {
    const parents = search(navigation, navLink, match)
    toggleActiveGroup(item.id, parents)
  }

  // ** Reset Active & Open Group Arrays
  const resetActiveAndOpenGroups = () => {
    setGroupActive([])
    setGroupOpen([])
  }

  useEffect(() => {
    if (chainId && supportedChainIds.includes(chainId)) {
      history.push(`/${NETWORK_LABLES[chainId]}`)
    }
  }, [chainId])

  // ** Checks url & updates active item
  useEffect(() => {
    const setActiveItemAndChain = async () => {
      if (currentActiveItem) {
        const previousActiveItem = activeItem
        setActiveItem(currentActiveItem)
        const res = await switchChain(Number(item.id))
        if (!res) {
          const arr = searchParents(navigation, currentURL)
          setGroupActive([...arr])
        } else {
          setActiveItem(previousActiveItem)
          if (previousActiveItem) history.push(`${previousActiveItem}`)
        }
      }
    }
    setActiveItemAndChain()
  }, [location])

  return (
    <li
      className={classnames({
        'nav-item my-1': !item.children,
        disabled: item.disabled,
        active: item.navLink === activeItem
      })}
      style={{ backgroundColor: COLOR[item.id], borderRadius: '10px' }}
    >
      <LinkTag
        className='d-flex align-items-center'
        target={item.newTab ? '_blank' : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? {
            href: item.navLink || '/'
          }
          : {
            to: item.navLink || '/',
            isActive: (match, location) => {
              if (!match) {
                return false
              }

              if (match.url && match.url !== '' && match.url === item.navLink) {
                currentActiveItem = item.navLink
              }
            }
          })}
        /*eslint-enable */
        onClick={e => {
          if (!item.navLink.length) {
            e.preventDefault()
          }
          parentItem ? resetActiveGroup(item.navLink) : resetActiveAndOpenGroups()
        }}
      >
        {item.icon}
        <span className='menu-item text-truncate' style={{ color: 'black' }}>{item.title}</span>
        <div className='ml-auto mr-0'>
          {item.chainIcon}
        </div>
      </LinkTag>
    </li>
  )
}

export default VerticalNavMenuLink
