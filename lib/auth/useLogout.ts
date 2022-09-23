import { browser } from "$app/environment"

import { CachePolicy, GQL_GetCurrentUser, GQL_LogoutUser } from "$houdini"

export const removeAuthCookies = async () => {
	if (browser) {
		console.log("Removing cookies")

		await fetch("/auth", { method: "POST", body: JSON.stringify({ action: "LOGOUT" }) })
			.then((r) => {
				console.log("Removed response", r)
			})
			.catch((e) => {
				console.error("removeAuthCookies", e)

				// TODO - Handle Error
			})
	}
}

export const useLogout = async () => {
	console.log("Using Logout")
	const response = await GQL_LogoutUser.mutate({ input: {} }).then(async (r) => {
		console.log("Logout response", r)

		const data = r
		if (data?.logout?.status === "SUCCESS") {
			GQL_GetCurrentUser.fetch({ policy: CachePolicy.NetworkOnly })
			await removeAuthCookies()
			return true
		}
		console.log("LOGOUT", r)
		return false
	})

	return response
}
