import { ContractRunner, Contract } from "ethers"

import contractABI from "./coreto_token/abi.json"

export const CoretoTokenAdapter = {
	use: (contractRunner: ContractRunner) =>
		new Contract("0x9C2dc0c3CC2BADdE84B0025Cf4df1c5aF288D835", contractABI, contractRunner),
}
