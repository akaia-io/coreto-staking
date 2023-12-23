import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "preact/hooks"

import { Balance } from "../../common/lib"
import { NetworkConnector } from "../../common/ui"

interface WidgetViewportProps extends WidgetEnv {}

export const WidgetViewport = (cx: WidgetViewportProps) => {
	const { Metamask } = cx,
		{ connector } = useWeb3React(),
		activeChainId = Metamask.useChainId(),
		isActivating = Metamask.useIsActivating(),
		isActive = Metamask.useIsActive(),
		balance = Balance.useWallet(cx),
		stakingBalance = Balance.useStaking(cx),
		isStakingAvailable = isActive && parseFloat(stakingBalance.cor) > 0

	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		if (typeof cx.accountAddress === "string") {
			cx.CoretoStaking?.getTokenStakingIdByAddress(cx.accountAddress).then((response) =>
				console.log(response),
			)

			// Only for testing purposes
			// cx.CoretoStaking?.stakeToken("60000000000000000000000", "3888000", { gasLimit: 3000 })
		}
	}, [activeChainId, cx, isActive])

	return (
		<div
			un-flex="~ col"
			un-items="center"
			un-justify="start"
			un-overflow="auto"
			un-rounded="4"
			un-w="full"
			un-max-w="480px"
			un-h="full"
			un-max-h="640px"
			un-bg="#0b2845"
			un-color="#e6ecf3"
		>
			<header
				un-flex="~ items-center justify-between"
				un-p="4"
				un-w="full"
				un-h="8%"
				un-border-b="1px solid #cfd8e3"
				un-border-b-opacity="25"
			>
				<h2 un-flex="~" un-gap="2" un-text="6">
					{isActive ? <span>🦊 MetaMask</span> : null}

					<span>
						{error
							? `🔴 ${error.name ?? "Error"} ${error.message ? `: ${error.message}` : ""}`
							: isActivating
							? "🟡 is connecting..."
							: isActive
							? "🟢 connected"
							: "⚪️ not connected"}
					</span>
				</h2>

				<NetworkConnector {...{ activeChainId, connector, isActivating, isActive, setError }} />
			</header>

			<main un-flex="~ col items-center justify-center" un-gap="4" un-p="4" un-w="full" un-h="92%">
				{activeChainId !== 1 ? (
					<div
						un-flex="~ col items-center justify-center"
						un-gap="6"
						un-p="4"
						un-w="full"
						un-text="8"
					>
						<h3 un-m="0" un-text="red">
							Wrong network!
						</h3>

						<span un-text="red center">Please switch MetaMask to Ethereum Mainnet</span>
					</div>
				) : (
					<>
						<div un-flex="~ col items-center" un-p="4" un-w="full" un-text="8">
							<span>Wallet balance</span>

							<ul un-flex="~ col" un-gap="3" un-w="full" un-p="0">
								<li un-flex="~" un-gap="2">
									<span>{balance.eth}</span>
									<span un-text="blue">ETH</span>
								</li>

								<li un-flex="~" un-gap="2">
									<span>{balance.cor}</span>
									<span un-text="blue">COR</span>
								</li>
							</ul>
						</div>

						<div un-flex="~ col items-center" un-p="4" un-w="full" un-text="8">
							<span>Staked tokens</span>

							<ul un-flex="~ col" un-gap="3" un-w="full" un-p="0">
								<li un-flex="~" un-gap="2">
									<span>{stakingBalance.cor}</span>
									<span un-text="blue">COR</span>
								</li>
							</ul>
						</div>

						<button
							disabled={!isStakingAvailable}
							type="button"
							un-bg="accent"
							un-color="white"
							un-p="x-3 y-2"
							un-rounded="4"
							un-text="5"
							un-cursor="pointer"
							un-disabled="bg-gray-600 color-gray-500 cursor-not-allowed"
						>
							Unstake
						</button>
					</>
				)}
			</main>
		</div>
	)
}
