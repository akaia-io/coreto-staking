import { Web3Provider } from "@ethersproject/providers"
import { Web3ReactHooks } from "@web3-react/core"
import { Connector } from "@web3-react/types"
import { AbstractProvider, Contract } from "ethers"

declare global {
	interface ContractAdapter {
		use: (provider: Web3Provider) => Contract
	}

	interface WalletAdapter extends Web3ReactHooks {
		fallback: AbstractProvider
		api: Connector
	}

	interface WidgetEnv {
		env: {
			CoretoToken: Contract
			CoretoStaking: Contract
			Metamask: WalletAdapter
		}
	}
}
