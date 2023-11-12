import { initializeConnector } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"
import { BrowserProvider, Eip1193Provider, getDefaultProvider } from "ethers"

import { URLS } from "../config"

const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>(
	(actions) => new MetaMask({ actions }),
)

export const MetamaskAdapter: WalletAdapter = {
	fallback:
		window.ethereum === null
			? getDefaultProvider(URLS["1"][0])
			: new BrowserProvider(window.ethereum as Eip1193Provider),

	api: metaMask,
	...metaMaskHooks,
}
