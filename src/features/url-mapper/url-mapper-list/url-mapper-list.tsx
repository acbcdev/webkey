import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/features/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/features/ui/dropdown-menu"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/features/ui/item"
import type { UrlMapperMapping } from "../use-url-mapper"

interface UrlMapperListProps {
	mappings: UrlMapperMapping[]
	onDelete: (domain: string) => void
	onEdit: (mapping: UrlMapperMapping) => void
}

export function UrlMapperList({
	mappings,
	onDelete,
	onEdit,
}: UrlMapperListProps) {
	return (
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
								<DropdownMenuItem onClick={() => onEdit(mapping)}>
									<Pencil className="mr-2 size-4" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									variant="destructive"
									onClick={() => onDelete(mapping.domain)}
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
	)
}
