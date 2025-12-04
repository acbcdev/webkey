import { ScrollArea } from "@/features/ui/scroll-area"
import { Separator } from "@/features/ui/separator"
import { Switch } from "@/features/ui/switch"
import { useFeatureConfig } from "../use-feature-config"

export function ConfigPanelManager() {
	const { config, toggleFeature, hasChanges } = useFeatureConfig()

	const features = [
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
			description: "Copy last response to clipboard (Alt+C)",
		},
		{
			key: "global" as const,
			label: "Global Shortcuts",
			description: "Custom home navigation (Ctrl/Cmd+Shift+H)",
		},
	]

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
					{features.map((feature, index) => (
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
				</div>
			</ScrollArea>
		</div>
	)
}
