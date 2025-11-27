import { useCallback, useEffect, useState } from "react"
import { useStore } from "@/lib/hooks"
import { type FeatureConfig, featureConfig } from "@/lib/storage/feature-config"

export function useFeatureConfig() {
	const [config, setConfig] = useStore(featureConfig)
	const [hasChanges, setHasChanges] = useState(false)

	// Check if current config matches initial config from storage
	useEffect(() => {
		const checkChanges = async () => {
			const initialConfig = await featureConfig.getValue()
			const hasAnyChanges = Object.keys(config).some(
				(key) =>
					config[key as keyof FeatureConfig] !==
					initialConfig[key as keyof FeatureConfig],
			)
			setHasChanges(hasAnyChanges)
		}

		checkChanges()
	}, [config])

	const toggleFeature = useCallback(
		async (feature: keyof FeatureConfig, enabled: boolean) => {
			const newConfig: FeatureConfig = { ...config, [feature]: enabled }
			await setConfig(newConfig)
		},
		[config, setConfig],
	)

	return { config, toggleFeature, hasChanges }
}
