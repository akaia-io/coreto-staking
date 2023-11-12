import type { Web3ReactHooks } from "@web3-react/core"
import { Connector } from "@web3-react/types"
import { StateUpdater, useCallback, useEffect, useState } from "preact/hooks"

import { getAddChainParameters } from "../config"

export const NetworkConnector = ({
	connector,
	activeChainId,
	isActivating,
	isActive,
	setError,
}: {
	connector: Connector
	activeChainId: ReturnType<Web3ReactHooks["useChainId"]>
	isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>
	isActive: ReturnType<Web3ReactHooks["useIsActive"]>
	setError: StateUpdater<Error | null>
}) => {
	const [desiredChainId, setDesiredChainId] = useState<number>(1)

	/**
	 * When user connects eagerly (`desiredChainId` is null) or to the default chain (`desiredChainId` is -1),
	 * update the `desiredChainId` value so that <select /> has the right selection.
	 */
	useEffect(() => {
		if (activeChainId && (!desiredChainId || desiredChainId === -1)) {
			setDesiredChainId(activeChainId)
		}
	}, [desiredChainId, activeChainId])

	const switchChain = useCallback(
		async (desiredChainId: number) => {
			setDesiredChainId(desiredChainId)

			try {
				if (
					// If we're already connected to the desired chain, return
					desiredChainId === activeChainId ||
					// If they want to connect to the default chain and we're already connected, return
					(desiredChainId === -1 && activeChainId !== null)
				) {
					setError(null)
					return
				}

				await connector.activate(getAddChainParameters(desiredChainId))

				setError(null)
			} catch (error: unknown) {
				setError(error as Error)
			}
		},

		[connector, activeChainId, setError],
	)

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			{isActive ? null : (
				<button disabled={isActivating} onClick={() => switchChain(desiredChainId)} type="button">
					Connect MetaMask
				</button>
			)}
		</div>
	)
}
