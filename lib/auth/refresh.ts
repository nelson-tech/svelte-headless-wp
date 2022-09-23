import { browser } from "$app/environment"

export const refreshAuthToken = async () => {
	if (browser) {
		const response = await fetch("/auth", {
			method: "POST",
			body: JSON.stringify({ action: "REFRESH" }),
		})
		const data = await response.json()
		console.log("REFRESH DATA", data)
	}
}
