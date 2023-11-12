import { BigNumber } from "@ethersproject/bignumber"
import { formatEther, formatUnits } from "@ethersproject/units"
import { Contract } from "ethers"
import { useEffect, useState } from "preact/hooks"

const unknownValue = "unknown amount of"

interface WalletBalanceViewerInputs {
	Metamask: WalletAdapter
	CoretoToken: Contract
}

interface StakingBalanceViewerInputs {
	Metamask: WalletAdapter
	CoretoToken: Contract
	CoretoStaking: Contract
}

export const useWallet = ({
	Metamask,
	CoretoToken,
}: WalletBalanceViewerInputs): { eth: string; cor: string } => {
	const defaultBalances: { eth: string; cor: string } = {
		eth: unknownValue,
		cor: unknownValue,
	}

	const accountAddresses = Metamask.useAccounts() ?? [],
		accountAddress = accountAddresses[0],
		provider = Metamask.useProvider(),
		isAbleToView = provider !== undefined && typeof accountAddress === "string",
		[balances, balancesUpdate] = useState<typeof defaultBalances>(defaultBalances),
		[stale, staleStateUpdate] = useState<boolean>(false)

	useEffect(() => {
		if (isAbleToView) {
			void Promise.all([
				provider.getBalance(accountAddress),
				CoretoToken.balanceOf(accountAddress),
				CoretoToken.decimals(),
			]).then(([ethBalance, corBalance, corDecimals]) => {
				if (!stale) {
					balancesUpdate((lastKnownState) => ({
						...lastKnownState,
						eth: formatEther(ethBalance),
						cor: formatUnits(corBalance, corDecimals),
					}))
				}
			})

			return () => {
				staleStateUpdate(true)
				balancesUpdate(defaultBalances)
			}
		}
	}, [isAbleToView, accountAddress, stale])

	return balances
}

export const useStaking = ({
	Metamask,
	CoretoToken,
	CoretoStaking,
}: StakingBalanceViewerInputs): { cor: string } => {
	const defaultBalances: { cor: string } = {
		cor: unknownValue,
	}

	const accountAddresses = Metamask.useAccounts() ?? [],
		accountAddress = accountAddresses[0],
		provider = Metamask.useProvider(),
		isAbleToView = provider !== undefined && typeof accountAddress === "string",
		[balances, balancesUpdate] = useState<typeof defaultBalances>(defaultBalances),
		[stale, staleStateUpdate] = useState<boolean>(false)

	useEffect(() => {
		if (isAbleToView) {
			void Promise.all([CoretoToken.decimals(), CoretoStaking.getTokenStakingCount()]).then(
				([corDecimals, stakedValue]) => {
					if (!stale) {
						balancesUpdate({
							cor: formatUnits(stakedValue, corDecimals),
						})
					}
				},
			)

			return () => {
				staleStateUpdate(true)
				balancesUpdate(defaultBalances)
			}
		}
	}, [isAbleToView, accountAddress, stale])

	return balances
}
