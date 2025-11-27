import { useCallback, useMemo } from "react"
import { useStore } from "@/lib/hooks"
import {
	customHomeUrls,
	removeCustomHomeUrl,
	setCustomHomeUrl,
} from "@/lib/storage/home-urls"

function shortenUrl(url: string, maxLength: number = 40): string {
	if (url.length <= maxLength) {
		return url
	}
	return `${url.substring(0, maxLength - 3)}...`
}

export interface UrlMapperMapping {
	domain: string
	url: string
	displayUrl: string
}

export function useUrlMapper() {
	const [urls] = useStore(customHomeUrls)

	const mappings = useMemo(
		() =>
			Object.entries(urls as Record<string, string>).map(([domain, url]) => ({
				domain,
				url,
				displayUrl: shortenUrl(url),
			})),
		[urls],
	)

	const addMapping = useCallback(
		async (domain: string, url: string) => {
			await setCustomHomeUrl(domain, url)
		},
		[],
	)

	const removeMapping = useCallback(
		async (domain: string) => {
			await removeCustomHomeUrl(domain)
		},
		[],
	)

	return {
		mappings,
		addMapping,
		removeMapping,
	}
}
