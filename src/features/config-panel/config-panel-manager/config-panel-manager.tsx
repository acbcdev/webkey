import { ScrollArea } from "@/features/ui/scroll-area"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/features/ui/select"
import { Separator } from "@/features/ui/separator"
import { Switch } from "@/features/ui/switch"
import type { ToastPosition, ToastSize } from "@/lib/storage/toast-config"
import { useFeatureConfig } from "../use-feature-config"
import { useToastConfig } from "../use-toast-config"

const FEATURES = [
	{
		key: "gmail" as const,
		label: "Gmail",
		description: "Email navigation and account switching shortcuts",
	},
	{
		key: "platzi" as const,
		label: "Platzi Search",
		description: "Quick search focus toggle (Cmd/Ctrl+K)",
	},
	{
		key: "platziQuiz" as const,
		label: "Platzi Quiz",
		description: "Quiz navigation, option selection, and mark states",
	},
	{
		key: "platziCursos" as const,
		label: "Platzi Courses",
		description: "Content copying shortcuts in course pages",
	},
	{
		key: "notion" as const,
		label: "Notion",
		description: "Gallery item creation shortcuts",
	},
	{
		key: "chatgpt" as const,
		label: "ChatGPT",
		description: "Copy last response to clipboard (Shift+Alt+C)",
	},
	{
		key: "global" as const,
		label: "Global Shortcuts",
		description:
			"Home navigation (⌘/Ctrl+Shift+H), open home in new tab (⌘/Ctrl+Alt+T), open current in new tab (⌘/Ctrl+Alt+Shift+T)",
	},
]

const TOAST_POSITIONS: { value: ToastPosition; label: string }[] = [
	{ value: "bottom-right", label: "Bottom Right" },
	{ value: "bottom-left", label: "Bottom Left" },
	{ value: "bottom-center", label: "Bottom Center" },
	{ value: "top-right", label: "Top Right" },
	{ value: "top-left", label: "Top Left" },
	{ value: "top-center", label: "Top Center" },
]

const TOAST_SIZES: { value: ToastSize; label: string }[] = [
	{ value: "sm", label: "Small" },
	{ value: "md", label: "Medium" },
	{ value: "lg", label: "Large" },
]

const TOAST_SELECTS = [
	{
		label: "Position",
		key: "position" as const,
		options: TOAST_POSITIONS,
	},
	{
		label: "Size",
		key: "size" as const,
		options: TOAST_SIZES,
	},
]

export function ConfigPanelManager() {
	const { config, toggleFeature, hasChanges } = useFeatureConfig()
	const { config: toast, setPosition, setSize } = useToastConfig()

	const toastSetters = { position: setPosition, size: setSize }

	return (
		<div className="bg-background text-foreground py-4 px-2 flex flex-col gap-4">
			<div className="px-2">
				<h2 className="text-lg font-semibold">Feature Configuration</h2>
				<p className="text-sm text-muted-foreground">
					Enable or disable shortcuts. Refresh the page for changes to take
					effect.
				</p>
			</div>

			{hasChanges && (
				<div className="mx-2 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
					<p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
						⚠️ Refresh the page to apply changes
					</p>
				</div>
			)}

			<ScrollArea className="flex-1 px-2">
				<div className="space-y-4">
					{FEATURES.map((feature, index) => (
						<div key={feature.key}>
							{index > 0 && <Separator className="my-4" />}
							<div className="flex items-center justify-between gap-4">
								<div className="flex-1">
									<label
										htmlFor={feature.key}
										className="text-sm font-medium cursor-pointer"
									>
										{feature.label}
									</label>
									<p className="text-xs text-muted-foreground mt-1">
										{feature.description}
									</p>
								</div>
								<Switch
									id={feature.key}
									checked={
										(config as unknown as Record<string, boolean>)[
											feature.key
										] ?? false
									}
									onCheckedChange={(checked) =>
										toggleFeature(feature.key, checked)
									}
								/>
							</div>
						</div>
					))}

					<Separator className="my-4" />

					<div>
						<p className="text-sm font-medium mb-1">Toast Notifications</p>
						<p className="text-xs text-muted-foreground mb-3">
							Configure the position and size of toast notifications
						</p>

						<div className="flex flex-col gap-3">
							{TOAST_SELECTS.map(({ label, key, options }) => (
								<div
									key={key}
									className="flex items-center justify-between gap-4"
								>
									<label htmlFor={`toast-${key}`} className="text-sm text-muted-foreground">
										{label}
									</label>
									<Select
										value={toast[key]}
										onValueChange={(v) => toastSetters[key](v as never)}
									>
										<SelectTrigger id={`toast-${key}`} className="w-40">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{options.map(({ value, label: optLabel }) => (
												<SelectItem key={value} value={value}>
													{optLabel}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							))}
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	)
}
