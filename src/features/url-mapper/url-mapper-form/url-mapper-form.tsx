import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
} from "@/features/ui/input-group"
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
		<InputGroup className="flex-1 has-[>[data-align=inline-start]]:[&>input]:pl-px">
			<InputGroupAddon align="inline-start">
				<InputGroupText className="text-lg">/</InputGroupText>
			</InputGroupAddon>
			<InputGroupInput
				value={pathInput}
				onChange={(e) => setPathInput(e.target.value)}
			/>
			<InputGroupAddon align="inline-end">
				<Tooltip>
					<TooltipTrigger asChild>
						<InputGroupButton size="icon-xs" onClick={handleAdd}>
							<Plus className="size-4" />
						</InputGroupButton>
					</TooltipTrigger>
					<TooltipContent>Add current path</TooltipContent>
				</Tooltip>
			</InputGroupAddon>
		</InputGroup>
	)
}
