import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/features/ui/button"
import { Input } from "@/features/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/ui/tooltip"

interface UrlMapperFormProps {
	defaultPath: string
	onAdd: (path: string) => void
}

export function UrlMapperForm({ defaultPath, onAdd }: UrlMapperFormProps) {
	// State only holds the path AFTER the slash
	const [pathInput, setPathInput] = useState("")

	useEffect(() => {
		// Strip leading slash if present
		const cleanPath = defaultPath.startsWith("/")
			? defaultPath.slice(1)
			: defaultPath
		setPathInput(cleanPath)
	}, [defaultPath])

	const handleAdd = () => {
		// Always prepend slash when adding
		onAdd(`/${pathInput}`)
	}

	return (
		<div className="flex gap-2">
			<div className="relative flex-1 flex items-center">
				<span className="absolute left-3 text-muted-foreground select-none">
					/
				</span>
				<Input
					value={pathInput}
					onChange={(e) => setPathInput(e.target.value)}
					// placeholder="current-path"
					className="w-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-ring pl-6"
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
	)
}
