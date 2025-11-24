import { useCallback, useEffect, useState } from "react"
import {
	getCustomHomeUrls,
	removeCustomHomeUrl,
	setCustomHomeUrl,
} from "@/lib/storage/home-urls"

export interface UrlMapperMapping {
	domain: string
	url: string
}

export function useUrlMapper() {
	const [mappings, setMappings] = useState<UrlMapperMapping[]>([])

	const loadMappings = useCallback(async () => {
		const urls = await getCustomHomeUrls()
		setMappings(Object.entries(urls).map(([domain, url]) => ({ domain, url })))
	}, [])

	useEffect(() => {
		loadMappings()
	}, [loadMappings])

	const addMapping = useCallback(
		async (domain: string, url: string) => {
			await setCustomHomeUrl(domain, url)
			await loadMappings()
		},
		[loadMappings],
	)

	const removeMapping = useCallback(
		async (domain: string) => {
			await removeCustomHomeUrl(domain)
			await loadMappings()
		},
		[loadMappings],
	)

	return {
		mappings,
		addMapping,
		removeMapping,
		refreshMappings: loadMappings,
	}
}
