import "@unocss/reset/normalize.css"
import "@unocss/reset/sanitize/assets.css"
import "@unocss/reset/sanitize/sanitize.css"
import "virtual:uno.css"

import { Web3ReactProvider } from "@web3-react/core"
import { h, render } from "preact"
import { useEffect, useMemo } from "preact/hooks"

import { CoretoStakingAdapter, CoretoTokenAdapter, MetamaskAdapter } from "./core/adapters"
import { StakingWidget } from "./widgets/staking"

const WidgetLauncher = () => {
	useEffect(() => {
		void MetamaskAdapter.api.connectEagerly?.()?.catch(() => {
			console.debug("Failed to connect to MetaMask")
		})
	}, [])

	return h(StakingWidget, {
		env: {
			CoretoToken: useMemo(() => CoretoTokenAdapter.use(MetamaskAdapter.fallback), []),
			CoretoStaking: useMemo(() => CoretoStakingAdapter.use(MetamaskAdapter.fallback), []),
			Metamask: MetamaskAdapter,
		},
	})
}

const { api: metamask, ...metamaskHooks } = MetamaskAdapter

render(
	h(Web3ReactProvider, {
		connectors: [[metamask, metamaskHooks]],
		children: h(WidgetLauncher, null),
	}),

	document.body,
)
