import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/features/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/features/ui/dropdown-menu"
import { Input } from "@/features/ui/input"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/features/ui/item"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/ui/tooltip"
import {
	getCustomHomeUrls,
	removeCustomHomeUrl,
	setCustomHomeUrl,
} from "@/lib/storage/home-urls"

interface HomeUrlMapping {
	domain: string
	url: string
}

export function HomeUrlManager() {
	const [mappings, setMappings] = useState<HomeUrlMapping[]>([])
	const [pathInput, setPathInput] = useState("")
	const [currentOrigin, setCurrentOrigin] = useState("")
	const [currentDomain, setCurrentDomain] = useState("")

	const loadMappings = useCallback(async () => {
		const urls = await getCustomHomeUrls()
		setMappings(Object.entries(urls).map(([domain, url]) => ({ domain, url })))
	}, [])

	const initializeCurrentTab = useCallback(async () => {
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
				setPathInput(urlObj.pathname)
			}
		} catch (e) {
			console.error("Failed to get current tab", e)
		}
	}, [])

	useEffect(() => {
		loadMappings()
		initializeCurrentTab()
	}, [loadMappings, initializeCurrentTab])

	const handleAdd = async () => {
		if (!pathInput || !currentDomain || !currentOrigin) return

		try {
			// Construct full URL from origin and path input
			// Ensure path starts with / if not present
			const path = pathInput.startsWith("/") ? pathInput : `/${pathInput}`
			const fullUrl = `${currentOrigin}${path}`

			await setCustomHomeUrl(currentDomain, fullUrl)
			setPathInput("") // Optional: clear or keep? Keeping might be better for "Set as current" feel, but usually add clears.
			// Re-initialize to current tab path or keep cleared?
			// User said "default value should be the currrent path name", implying on load.
			// I'll clear it to indicate success, or maybe reset to current tab path?
			// Let's reset to current tab path to allow easy re-adding or modification.
			initializeCurrentTab()

			await loadMappings()
		} catch (e) {
			console.error("Invalid URL construction", e)
		}
	}

	const handleDelete = async (domain: string) => {
		await removeCustomHomeUrl(domain)
		await loadMappings()
	}

	return (
		<div className="w-[600px] bg-background text-foreground p-4 flex flex-col gap-4">
			{/* Top Bar */}
			<div className="flex gap-2">
				<div className="relative flex-1 flex items-center">
					{/* <div className="absolute left-3 text-muted-foreground text-sm font-medium">
						{currentDomain ? currentDomain : "Domain"}
					</div> */}
					<Input
						value={pathInput}
						onChange={(e) => setPathInput(e.target.value)}
						placeholder="/current-path"
						className="w-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-ring"
					/>
				</div>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							size="icon"
							variant="secondary"
							onClick={handleAdd}
							className="shrink-0 rounded-l-none -ml-2 z-10"
						>
							<Plus className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Add current path</TooltipContent>
				</Tooltip>
			</div>

			{/* List */}
			<div className="flex flex-col gap-2">
				{mappings.map((mapping) => (
					<Item key={mapping.domain} className="p-3 bg-card hover:bg-accent/50">
						<ItemMedia variant="image">
							<img
								src={`https://www.google.com/s2/favicons?domain=${mapping.domain}&sz=64`}
								alt={`${mapping.domain} favicon`}
							/>
						</ItemMedia>
						<ItemContent>
							<ItemTitle>{mapping.domain}</ItemTitle>
							<ItemDescription>{mapping.url}</ItemDescription>
						</ItemContent>
						<ItemActions>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										size="icon"
										variant="ghost"
										className="size-8 text-muted-foreground hover:text-foreground"
									>
										<MoreVertical className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={() => {
											try {
												const url = new URL(mapping.url)
												setPathInput(url.pathname)
												setCurrentDomain(mapping.domain)
												setCurrentOrigin(url.origin)
											} catch {}
										}}
									>
										<Pencil className="mr-2 size-4" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem
										variant="destructive"
										onClick={() => handleDelete(mapping.domain)}
									>
										<Trash2 className="mr-2 size-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</ItemActions>
					</Item>
				))}
				{mappings.length === 0 && (
					<div className="text-center text-muted-foreground py-8 text-sm">
						No custom home URLs set. <br />
						Add one for the current tab above.
					</div>
				)}
			</div>
		</div>
	)
}
