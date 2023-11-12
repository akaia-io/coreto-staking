import type { AddEthereumChainParameter } from "@web3-react/types"

interface BasicChainInformation {
	urls: string[]
	name: string
}

interface ExtendedChainInformation extends BasicChainInformation {
	nativeCurrency: AddEthereumChainParameter["nativeCurrency"]
	blockExplorerUrls: AddEthereumChainParameter["blockExplorerUrls"]
}

function isExtendedChainInformation(
	chainInformation: BasicChainInformation | ExtendedChainInformation,
): chainInformation is ExtendedChainInformation {
	return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
	const chainInformation = CHAINS[chainId]
	if (isExtendedChainInformation(chainInformation)) {
		return {
			chainId,
			chainName: chainInformation.name,
			nativeCurrency: chainInformation.nativeCurrency,
			rpcUrls: chainInformation.urls,
			blockExplorerUrls: chainInformation.blockExplorerUrls,
		}
	} else {
		return chainId
	}
}

type ChainConfig = { [chainId: number]: BasicChainInformation | ExtendedChainInformation }

export const CHAINS: ChainConfig = {
	1: {
		name: "Ethereum Mainnet",
		urls: ["https://cloudflare-eth.com"],
	},
}

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{
	[chainId: number]: string[]
}>((accumulator, chainId) => {
	const validURLs: string[] = CHAINS[Number(chainId)].urls

	if (validURLs.length) {
		accumulator[Number(chainId)] = validURLs
	}

	return accumulator
}, {})
