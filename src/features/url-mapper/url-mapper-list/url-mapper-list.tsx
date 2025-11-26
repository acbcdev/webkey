import { ExternalLink, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
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
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "@/features/ui/item"
import { UrlMapperEditDialog } from "../url-mapper-edit-dialog"
import type { UrlMapperMapping } from "../use-url-mapper"

interface UrlMapperListProps {
	mappings: UrlMapperMapping[]
	onDelete: (domain: string) => void
	onEdit: (mapping: UrlMapperMapping) => Promise<void>
}

export function UrlMapperList({
	mappings,
	onDelete,
	onEdit,
}: UrlMapperListProps) {
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [editingMapping, setEditingMapping] = useState<UrlMapperMapping | null>(
		null,
	)

	const handleEditClick = (mapping: UrlMapperMapping) => {
		setEditingMapping(mapping)
		setIsEditDialogOpen(true)
	}

	const handleEditSave = async (domain: string, url: string) => {
		await onEdit({
			domain,
			url,
			displayUrl: url.length > 60 ? url.substring(0, 57) + "..." : url,
		})
		setEditingMapping(null)
	}

	return (
		<div className="flex flex-col gap-2 p-4 ">
			<ItemGroup>
				{mappings.map((mapping) => (
					<Item
						key={mapping.domain}
						className="p-3 flex-nowrap bg-card hover:bg-accent/50"
					>
						<ItemMedia variant="image">
							<img
								src={`https://www.google.com/s2/favicons?domain=${mapping.domain}&sz=128`}
								alt={`${mapping.domain} favicon`}
							/>
						</ItemMedia>
						<ItemContent>
							<ItemTitle>{mapping.domain}</ItemTitle>
							<ItemDescription
								className="line-clamp-1 overflow-hidden"
								title={mapping.url}
							>
								{mapping.displayUrl}
							</ItemDescription>
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
									<DropdownMenuItem asChild>
										<a
											href={mapping.url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center cursor-pointer"
										>
											<ExternalLink className="mr-2 size-4" />
											Go to Link
										</a>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleEditClick(mapping)}>
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
			</ItemGroup>

			{mappings.length === 0 && (
				<div className="text-center text-muted-foreground py-8 text-sm">
					No custom home URLs set. <br />
					Add one for the current tab above.
				</div>
			)}

			<UrlMapperEditDialog
				mapping={editingMapping}
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
				onSave={handleEditSave}
			/>
		</div>
	)
}
