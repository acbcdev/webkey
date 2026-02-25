import { storage } from "@wxt-dev/storage"

export type ToastPosition =
	| "bottom-right"
	| "bottom-left"
	| "top-right"
	| "top-left"
	| "top-center"
	| "bottom-center"

export type ToastSize = "sm" | "md" | "lg"

export interface ToastConfig {
	position: ToastPosition
	size: ToastSize
}

const DEFAULT_TOAST_CONFIG: ToastConfig = {
	position: "bottom-right",
	size: "md",
}

export const toastConfig = storage.defineItem<ToastConfig>(
	"local:toastConfig",
	{ defaultValue: DEFAULT_TOAST_CONFIG },
)
