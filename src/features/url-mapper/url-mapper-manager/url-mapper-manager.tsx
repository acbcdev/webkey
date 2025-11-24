import { useEffect, useState } from "react"
import { UrlMapperForm } from "../url-mapper-form"
import { UrlMapperList } from "../url-mapper-list"
import { useCurrentTab } from "../use-current-tab"
import { type UrlMapperMapping, useUrlMapper } from "../use-url-mapper"

export function UrlMapperManager() {
	const { mappings, addMapping, removeMapping } = useUrlMapper()
	const { currentOrigin, currentDomain, currentPath } = useCurrentTab()

	// State for the form context (domain/origin we are editing/adding)
	const [targetDomain, setTargetDomain] = useState("")
	const [targetOrigin, setTargetOrigin] = useState("")
	const [formDefaultPath, setFormDefaultPath] = useState("")

	// Initialize form with current tab info when available
	useEffect(() => {
		if (currentDomain && currentOrigin) {
			setTargetDomain(currentDomain)
			setTargetOrigin(currentOrigin)
			setFormDefaultPath(currentPath)
		}
	}, [currentDomain, currentOrigin, currentPath])

	const handleAdd = async (pathInput: string) => {
		if (!pathInput || !targetDomain || !targetOrigin) return

		try {
			const path = pathInput.startsWith("/") ? pathInput : `/${pathInput}`
			const fullUrl = `${targetOrigin}${path}`

			await addMapping(targetDomain, fullUrl)

			// Reset to current tab info after adding
			if (currentDomain && currentOrigin) {
				setTargetDomain(currentDomain)
				setTargetOrigin(currentOrigin)
				setFormDefaultPath(currentPath)
			}
		} catch (e) {
			console.error("Invalid URL construction", e)
		}
	}

	const handleEdit = (mapping: UrlMapperMapping) => {
		try {
			const url = new URL(mapping.url)
			setTargetDomain(mapping.domain)
			setTargetOrigin(url.origin)
			setFormDefaultPath(`${url.pathname}${url.search}${url.hash}`)
		} catch (e) {
			console.error("Failed to parse URL for editing", e)
		}
	}

	return (
		<div className="w-[600px] bg-background text-foreground p-4 flex flex-col gap-4">
			<UrlMapperForm defaultPath={formDefaultPath} onAdd={handleAdd} />
			<UrlMapperList
				mappings={mappings}
				onDelete={removeMapping}
				onEdit={handleEdit}
			/>
		</div>
	)
}
