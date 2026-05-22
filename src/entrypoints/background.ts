import {
	goToHomeBackground,
	openCurrentInNewTabBackground,
	openHomeInNewTabBackground,
} from "@/lib/navigation/home"
import { customHomeUrls } from "@/lib/storage/home-urls"

export default defineBackground(() => {
	browser.runtime.onInstalled.addListener(async () => {
		const existing = await customHomeUrls.getValue()
		if (!existing) {
			await customHomeUrls.setValue({})
		}
	})

	browser.commands.onCommand.addListener((command) => {
		if (command === "go-to-home") goToHomeBackground().catch(console.error)
		else if (command === "open-home-new-tab")
			openHomeInNewTabBackground().catch(console.error)
		else if (command === "open-current-new-tab")
			openCurrentInNewTabBackground().catch(console.error)
	})
})
