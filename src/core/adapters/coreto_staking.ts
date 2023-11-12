import { ContractRunner, Contract } from "ethers"

import contractABI from "./coreto_staking/abi.json"

export const CoretoStakingAdapter = {
	use: (provider: ContractRunner) =>
		new Contract("0x005685a5a1889FC7BFc3e9c11657703A67fB663B", contractABI, provider),
}
