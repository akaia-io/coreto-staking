import { Web3Provider } from "@ethersproject/providers"
import { Web3ReactHooks } from "@web3-react/core"
import { Connector } from "@web3-react/types"
import { AbstractProvider, Contract, ContractRunner } from "ethers"

declare global {
	interface ContractAdapter {
		use: (contractRunner: ContractRunner) => Contract
	}

	interface WalletAdapter extends Web3ReactHooks {
		fallback: AbstractProvider
		api: Connector
	}

	interface WidgetEnv {
		isConnected: boolean
		accountAddress: string | null
		provider: Web3Provider | null
		Metamask: WalletAdapter
		CoretoToken: Contract | null
		CoretoStaking: Contract | null
	}
}
