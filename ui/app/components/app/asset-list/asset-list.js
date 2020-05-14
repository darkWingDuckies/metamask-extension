import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import AddTokenButton from '../add-token-button'
import TokenList from '../token-list'
import { ADD_TOKEN_ROUTE } from '../../../helpers/constants/routes'
import AssetListItem from '../asset-list-item'
import CurrencyDisplay from '../../ui/currency-display'
import { PRIMARY, SECONDARY } from '../../../helpers/constants/common'
import { useMetricEvent } from '../../../hooks/useMetricEvent'
import { useUserPreferencedCurrency } from '../../../hooks/useUserPreferencedCurrency'
import { getCurrentAccountWithSendEtherInfo, getNativeCurrency, getShouldShowFiat } from '../../../selectors'
import { setSelectedToken } from '../../../store/actions'

const AssetList = ({ highlightActive, onClickAsset }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const selectedAccountBalance = useSelector((state) => getCurrentAccountWithSendEtherInfo(state).balance)
  const selectedTokenAddress = useSelector((state) => state.metamask.selectedTokenAddress)
  const nativeCurrency = useSelector(getNativeCurrency)
  const showFiat = useSelector(getShouldShowFiat)
  const selectTokenEvent = useMetricEvent({
    eventOpts: {
      category: 'Navigation',
      action: 'Token Menu',
      name: 'Clicked Token',
    },
  })
  const addTokenEvent = useMetricEvent({
    eventOpts: {
      category: 'Navigation',
      action: 'Token Menu',
      name: 'Clicked "Add Token"',
    },
  })

  const {
    currency: primaryCurrency,
    numberOfDecimals: primaryNumberOfDecimals,
  } = useUserPreferencedCurrency(PRIMARY, { ethNumberOfDecimals: 4 })
  const {
    currency: secondaryCurrency,
    numberOfDecimals: secondaryNumberOfDecimals,
  } = useUserPreferencedCurrency(SECONDARY, { ethNumberOfDecimals: 4 })

  return (
    <>
      <AssetListItem
        active={highlightActive && !selectedTokenAddress}
        onClick={() => {
          onClickAsset
            ? onClickAsset(nativeCurrency)
            : dispatch(setSelectedToken())
        }}
        data-testid="wallet-balance"
      >
        <CurrencyDisplay
          className="asset-list__primary-amount"
          currency={primaryCurrency}
          numberOfDecimals={primaryNumberOfDecimals}
          value={selectedAccountBalance}
        />
        {
          showFiat && (
            <CurrencyDisplay
              className="asset-list__secondary-amount"
              currency={secondaryCurrency}
              numberOfDecimals={secondaryNumberOfDecimals}
              value={selectedAccountBalance}
            />
          )
        }
      </AssetListItem>
      <TokenList
        highlightActive={highlightActive}
        onTokenClick={(tokenAddress) => {
          onClickAsset
            ? onClickAsset(tokenAddress)
            : dispatch(setSelectedToken(tokenAddress))
          selectTokenEvent()
        }}
      />
      <AddTokenButton
        onClick={() => {
          history.push(ADD_TOKEN_ROUTE)
          addTokenEvent()
        }}
      />
    </>
  )
}

AssetList.propTypes = {
  highlightActive: PropTypes.bool,
  onClickAsset: PropTypes.func,
}

AssetList.defaultProps = {
  highlightActive: true,
  onClickAsset: undefined,
}

export default AssetList
