import "@unocss/reset/normalize.css"
import "@unocss/reset/sanitize/assets.css"
import "@unocss/reset/sanitize/sanitize.css"
import "virtual:uno.css"

import { Web3ReactProvider } from "@web3-react/core"
import { ContractRunner } from "ethers"
import { h, render } from "preact"
import { useEffect, useMemo } from "preact/hooks"

import { CoretoStakingAdapter, CoretoTokenAdapter, MetamaskAdapter } from "./common/adapters"
import { WidgetViewport } from "./viewports/widget"

const Launcher = () => {
	useEffect(() => {
		void MetamaskAdapter.api.connectEagerly?.()?.catch(() => {
			console.debug("Failed to connect to MetaMask")
		})
	}, [])

	const provider = MetamaskAdapter.useProvider() ?? null,
		accountAddress = (MetamaskAdapter.useAccounts() ?? [])[0]

	const signer = provider?.getSigner() ?? null

	const isConnected =
		typeof accountAddress === "string" &&
		CoretoTokenAdapter !== null &&
		CoretoStakingAdapter !== null

	return h(WidgetViewport, {
		isConnected,
		provider,
		accountAddress,
		Metamask: MetamaskAdapter,

		CoretoToken: useMemo(
			() => (signer !== null ? CoretoTokenAdapter.use(signer as unknown as ContractRunner) : null),
			[signer],
		),

		CoretoStaking: useMemo(
			() =>
				signer !== null ? CoretoStakingAdapter.use(signer as unknown as ContractRunner) : null,

			[signer],
		),
	})
}

const { api: metamask, ...metamaskHooks } = MetamaskAdapter

render(
	h(Web3ReactProvider, {
		connectors: [[metamask, metamaskHooks]],
		children: h(Launcher, null),
	}),

	document.body,
)
