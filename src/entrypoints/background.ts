import { customHomeUrls } from "@/lib/storage/home-urls"

export default defineBackground(() => {
	browser.runtime.onInstalled.addListener(async () => {
		const existing = await customHomeUrls.getValue()
		if (!existing) {
			await customHomeUrls.setValue({})
		}
	})
})
