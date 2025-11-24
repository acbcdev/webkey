import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/features/ui/button"
import { Input } from "@/features/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/ui/tooltip"

interface PopupUrlFormProps {
	defaultPath: string
	onAdd: (path: string) => void
}

export function PopupUrlForm({ defaultPath, onAdd }: PopupUrlFormProps) {
	const [pathInput, setPathInput] = useState(defaultPath)

	useEffect(() => {
		setPathInput(defaultPath)
	}, [defaultPath])

	const handleAdd = () => {
		onAdd(pathInput)
		// We might want to clear input here or let parent handle it via defaultPath change
		// But usually form clears itself or parent resets defaultPath.
		// In the original code, it cleared input or reset to current tab path.
		// Here, if parent passes new defaultPath (e.g. current tab path), it will update.
	}

	return (
		<div className="flex gap-2">
			<div className="relative flex-1 flex items-center">
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
	)
}
