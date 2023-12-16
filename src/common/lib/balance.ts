import { formatEther, formatUnits } from "@ethersproject/units"
import { useEffect, useState } from "preact/hooks"

const unknownValue = "unknown amount of"

export const useWallet = ({
	isConnected,
	provider,
	accountAddress,
	CoretoToken,
}: WidgetEnv): { eth: string; cor: string } => {
	const defaultBalances: { eth: string; cor: string } = {
		eth: unknownValue,
		cor: unknownValue,
	}

	const [balances, balancesUpdate] = useState<typeof defaultBalances>(defaultBalances),
		[stale, staleStateUpdate] = useState<boolean>(false)

	useEffect(() => {
		if (isConnected) {
			void Promise.all([
				provider?.getBalance(accountAddress ?? ""),
				CoretoToken?.balanceOf(accountAddress),
				CoretoToken?.decimals(),
			]).then(([ethBalance, corBalance, corDecimals]) => {
				if (!stale) {
					balancesUpdate((lastKnownState) => ({
						...lastKnownState,
						eth: ethBalance !== undefined ? formatEther(ethBalance) : unknownValue,
						cor: formatUnits(corBalance, corDecimals),
					}))
				}
			})

			return () => {
				staleStateUpdate(true)
				balancesUpdate(defaultBalances)
			}
		}
	}, [isConnected, accountAddress, stale])

	return balances
}

export const useStaking = ({
	isConnected,
	accountAddress,
	CoretoToken,
	CoretoStaking,
}: WidgetEnv): { cor: string } => {
	const defaultBalances: { cor: string } = {
		cor: unknownValue,
	}

	const [balances, balancesUpdate] = useState<typeof defaultBalances>(defaultBalances),
		[stale, staleStateUpdate] = useState<boolean>(false)

	useEffect(() => {
		if (isConnected) {
			void Promise.all([
				CoretoToken?.decimals(),
				CoretoStaking?.getTokenStakingIdByAddress(accountAddress),
			]).then(([corDecimals, stakingIds]) => {
				if (!stale) {
					CoretoStaking?.getFinalTokenStakeWithdraw(stakingIds.length > 0 ? stakingIds[0] : 0).then(
						(stakedValue) => balancesUpdate({
								cor: formatUnits(stakedValue, corDecimals),
							}),
					)
				}
			})

			return () => {
				staleStateUpdate(true)
				balancesUpdate(defaultBalances)
			}
		}
	}, [isConnected, accountAddress, stale])

	return balances
}
