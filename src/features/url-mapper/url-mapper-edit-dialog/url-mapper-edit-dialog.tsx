import { useEffect, useState } from "react"
import { Button } from "@/features/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/features/ui/dialog"
import { Input } from "@/features/ui/input"
import type { UrlMapperMapping } from "../use-url-mapper/use-url-mapper"

interface UrlMapperEditDialogProps {
	mapping: UrlMapperMapping | null
	open: boolean
	onOpenChange: (open: boolean) => void
	onSave: (domain: string, url: string) => Promise<void>
}

export function UrlMapperEditDialog({
	mapping,
	open,
	onOpenChange,
	onSave,
}: UrlMapperEditDialogProps) {
	const [domain, setDomain] = useState("")
	const [origin, setOrigin] = useState("")
	const [path, setPath] = useState("")
	const [isSaving, setIsSaving] = useState(false)

	// Parse mapping when dialog opens
	useEffect(() => {
		if (mapping && open) {
			try {
				const url = new URL(mapping.url)
				setDomain(mapping.domain)
				setOrigin(url.origin)
				setPath(`${url.pathname}${url.search}${url.hash}`)
			} catch (error) {
				console.error("Failed to parse mapping URL:", error)
			}
		}
	}, [mapping, open])

	// Construct full URL
	const fullUrl = origin && path ? `${origin}${path}` : ""

	// Handle save
	const handleSave = async () => {
		if (!domain || !path || !origin) {
			console.warn("Cannot save: missing required fields")
			return
		}

		setIsSaving(true)
		try {
			await onSave(domain, fullUrl)
			onOpenChange(false)
		} catch (error) {
			console.error("Failed to save mapping:", error)
		} finally {
			setIsSaving(false)
		}
	}

	// Handle dialog close and reset state
	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			// Reset state when closing
			setDomain("")
			setOrigin("")
			setPath("")
		}
		onOpenChange(newOpen)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Edit URL Mapping</DialogTitle>
					<DialogDescription>
						Update the home URL for this domain
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* Domain (disabled/readonly) */}
					<div className="space-y-2">
						<label htmlFor="edit-domain" className="text-sm font-medium">
							Domain
						</label>
						<Input
							id="edit-domain"
							value={domain}
							disabled
							className="bg-muted"
						/>
						<p className="text-xs text-muted-foreground">
							Domain cannot be changed. Delete and recreate to change domain.
						</p>
					</div>

					{/* Origin (disabled/readonly) */}
					<div className="space-y-2">
						<label htmlFor="edit-origin" className="text-sm font-medium">
							Base URL
						</label>
						<Input
							id="edit-origin"
							value={origin}
							disabled
							className="bg-muted"
						/>
						<p className="text-xs text-muted-foreground">
							Base URL cannot be changed. Only the path can be edited.
						</p>
					</div>

					{/* Path (editable) */}
					<div className="space-y-2">
						<label htmlFor="edit-path" className="text-sm font-medium">
							Path
						</label>
						<Input
							id="edit-path"
							value={path}
							onChange={(e) => setPath(e.target.value)}
							placeholder="/path/to/page"
						/>
						<p className="text-xs text-muted-foreground">
							Include query parameters and hash fragments as needed
						</p>
					</div>

					{/* URL Preview */}
					<div className="space-y-2">
						<label
							htmlFor="edit-preview"
							className="text-sm font-medium text-muted-foreground"
						>
							Preview
						</label>
						<Input
							id="edit-preview"
							value={fullUrl || "Invalid URL"}
							readOnly
							className="bg-muted font-mono text-muted-foreground"
						/>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => handleOpenChange(false)}
						disabled={isSaving}
					>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={isSaving || !path.trim()}>
						{isSaving ? "Saving..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
