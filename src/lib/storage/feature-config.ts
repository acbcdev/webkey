import { storage } from "@wxt-dev/storage"

/**
 * Storage utilities for managing feature toggle configurations
 */

export interface FeatureConfig {
	gmail: boolean
	platzi: boolean
	platziQuiz: boolean
	platziCursos: boolean
	notion: boolean
	global: boolean
	chatgpt: boolean
}

const DEFAULT_CONFIG: FeatureConfig = {
	gmail: true,
	platzi: true,
	platziQuiz: true,
	platziCursos: true,
	notion: true,
	global: true,
	chatgpt: true,
}

/**
 * Storage key for feature configuration
 */
const STORAGE_KEY = "local:featureConfig"

export const featureConfig = storage.defineItem<FeatureConfig>(STORAGE_KEY, {
	defaultValue: DEFAULT_CONFIG,
})

/**
 * Get all feature configurations
 */
export async function getFeatureConfig(): Promise<FeatureConfig> {
	return await featureConfig.getValue()
}

/**
 * Check if a specific feature is enabled
 */
export async function isFeatureEnabled(
	feature: keyof FeatureConfig,
): Promise<boolean> {
	const config = await getFeatureConfig()
	return config[feature]
}

/**
 * Set a feature's enabled status
 */
export async function setFeatureEnabled(
	feature: keyof FeatureConfig,
	enabled: boolean,
): Promise<void> {
	const config = await getFeatureConfig()
	config[feature] = enabled
	await featureConfig.setValue(config)
}
