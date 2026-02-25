import { useCallback } from "react"
import { useStore } from "@/lib/hooks"
import {
	type ToastPosition,
	type ToastSize,
	toastConfig,
} from "@/lib/storage/toast-config"

export function useToastConfig() {
	const [config, setConfig] = useStore(toastConfig)

	const setPosition = useCallback(
		async (position: ToastPosition) => {
			await setConfig({ ...config, position })
		},
		[config, setConfig],
	)

	const setSize = useCallback(
		async (size: ToastSize) => {
			await setConfig({ ...config, size })
		},
		[config, setConfig],
	)

	return { config, setPosition, setSize }
}
