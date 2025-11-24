import { useCallback, useEffect, useState } from "react"

export function useCurrentTab() {
	const [currentOrigin, setCurrentOrigin] = useState("")
	const [currentDomain, setCurrentDomain] = useState("")
	const [currentPath, setCurrentPath] = useState("")

	const refreshTabInfo = useCallback(async () => {
		try {
			const tabs = await browser.tabs.query({
				active: true,
				currentWindow: true,
			})
			const currentTab = tabs[0]
			if (currentTab?.url) {
				const urlObj = new URL(currentTab.url)
				setCurrentOrigin(urlObj.origin)
				setCurrentDomain(urlObj.hostname)
				setCurrentPath(`${urlObj.pathname}${urlObj.search}${urlObj.hash}`)
			}
		} catch (e) {
			console.error("Failed to get current tab", e)
		}
	}, [])

	useEffect(() => {
		refreshTabInfo()
	}, [refreshTabInfo])

	return {
		currentOrigin,
		currentDomain,
		currentPath,
		refreshTabInfo,
	}
}
