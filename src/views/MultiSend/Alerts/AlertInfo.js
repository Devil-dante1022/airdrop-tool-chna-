import React from 'react'
import { InformationCircleIcon } from '@heroicons/react/solid'

const BrewAlertInfo = ({
  message,
  linkText,
  externalLink,
}) => (
  <div className="rounded-lg max-w-2xl">
    <div className="flex">
      <div className="flex-shrink-0">
        <InformationCircleIcon className="h-10 w-10 text-gray-50" aria-hidden="true" />
      </div>
      <div className="ml-1 flex-1">
        <p className="text-gray-50" style={{ marginBottom: '5px' }}>Important message to airdrop tool users: To maximise your airdrop efficiency, please whitelist the airdrop contract address below. Please whitelist by calling <span className="whitespace-nowrap font-bold text-amber-400">excludeFee,</span> <span className="whitespace-nowrap font-bold text-amber-400">excludeMaxTransaction,</span> <span className="whitespace-nowrap font-bold text-amber-400">excludeMaxWallet</span> and <span className="whitespace-nowrap font-bold text-amber-400">activateTradingWhileDisabled</span> on your token smart contract where applicable.</p>
        {externalLink && (
          <p className="text-right" style={{ marginBottom: '0px' }}>
            <a
              href={externalLink}
              target="_blank"
              className="whitespace-nowrap font-bold text-amber-400 hover:text-yellow-600"
              rel="noreferrer"
            >
              {linkText}
              <span aria-hidden="true">&rarr;</span>
            </a>
          </p>
        )}
      </div>
    </div>
  </div>
)

export default BrewAlertInfo
