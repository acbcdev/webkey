import { useEffect, useState } from "react"
import type { WxtStorageItem } from "@wxt-dev/storage"

/**
 * Generic hook for reactive access to WXT storage items
 * Works with any storage.defineItem() instance
 *
 * @param storageItem - The storage item from storage.defineItem()
 * @returns [value, setValue] tuple like useState
 *
 * @example
 * const [config, setConfig] = useStore(featureConfig)
 * const [urls, setUrls] = useStore(customHomeUrls)
 */
export function useStore<T>(
	storageItem: WxtStorageItem<T, any>,
): [T, (value: T) => Promise<void>] {
	const [value, setValue] = useState<T>(storageItem.defaultValue)

	useEffect(() => {
		// Load initial value
		storageItem.getValue().then(setValue)

		// Watch for changes
		const unwatch = storageItem.watch((newValue: T | null | undefined) => {
			if (newValue !== null && newValue !== undefined) {
				setValue(newValue)
			}
		})

		return unwatch
	}, [storageItem])

	const setStorageValue = async (newValue: T) => {
		await storageItem.setValue(newValue)
		setValue(newValue)
	}

	return [value, setStorageValue]
}
