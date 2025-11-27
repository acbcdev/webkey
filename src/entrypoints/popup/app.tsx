import { ConfigPanelManager } from "@/features/config-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/ui/tabs"
import { UrlMapperManager } from "@/features/url-mapper"

export function App() {
	return (
		<div className="bg-background text-foreground pt-5 px-2">
			<Tabs defaultValue="home-urls" className="w-full h-full">
				<TabsList className="w-full grid grid-cols-2">
					<TabsTrigger value="home-urls">Home URLs</TabsTrigger>
					<TabsTrigger value="features">Features</TabsTrigger>
				</TabsList>
				<TabsContent value="home-urls" className="mt-0">
					<UrlMapperManager />
				</TabsContent>
				<TabsContent value="features" className="mt-0">
					<ConfigPanelManager />
				</TabsContent>
			</Tabs>
		</div>
	)
}
