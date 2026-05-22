import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],

	manifest: {
		name: "WebKey - Productivity Shortcuts",
		description:
			"Multi-website browser extension with custom keyboard shortcuts and productivity enhancements for Gmail, Platzi, Notion, and more.",
		version: "1.0.0",
		author: { email: "acbc.dev@gmail.com" },
		homepage_url: "https://github.com/acbcdev/webkey",
		permissions: ["storage", "activeTab", "tabs"],
		commands: {
			"go-to-home": {
				suggested_key: { default: "Ctrl+Shift+H", mac: "Command+Shift+H" },
				description: "Go to home page",
			},
			"open-home-new-tab": {
				suggested_key: { default: "Ctrl+Shift+E", mac: "Command+Shift+E" },
				description: "Open home in new tab",
			},
			"open-current-new-tab": {
				suggested_key: { default: "Alt+T", mac: "Alt+T" },
				description: "Open current page in new tab",
			},
		},
		action: {
			default_popup: "popup.html",
		},
		icons: {
			16: "/icon/16.png",
			32: "/icon/32.png",
			48: "/icon/48.png",
			96: "/icon/96.png",
			128: "/icon/128.png",
		},
	},

	srcDir: "src",
	vite: () => ({
		plugins: [tailwindcss()],
	}),
})
