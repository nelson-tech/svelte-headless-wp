import { HoudiniClient, type RequestHandlerArgs } from "$houdini"
import { AUTH_ENDPOINT } from "./lib/constants"
import { getSessionToken, setSessionToken } from "./lib/utils"

export type AppHeaders = {
	Authorization?: `Bearer ${string}`
	"woocommerce-session"?: `Session ${string}`
}

async function fetchQuery({ fetch, text = "", variables = {}, metadata }: RequestHandlerArgs) {
	// console.log("SESSION", session)

	// console.log("META", metadata)

	const url = import.meta.env.VITE_API_URL

	const headers: HeadersInit = {
		"Content-Type": "application/json",
	}

	let authToken: string | null = null

	if (metadata?.auth) {
		try {
			const data = await fetch(AUTH_ENDPOINT, {
				method: "POST",
				credentials: "include",
				headers,
				body: JSON.stringify({ action: "CHECK" }),
			})

			const dataText = await data.json()

			authToken = dataText.authToken
		} catch (error) {
			console.warn("Error getting body", AUTH_ENDPOINT)
		}
	}

	authToken && (headers["Authorization"] = `Bearer ${authToken}`)

	const wooSession = getSessionToken()
	wooSession && (headers["woocommerce-session"] = `Session ${wooSession}`)

	const result = await fetch(url, {
		method: "POST",
		credentials: "include",
		headers,
		body: JSON.stringify({
			query: text,
			variables,
		}),
	})

	setSessionToken(result.headers.get("woocommerce-session"))

	return await result.json()
}

export default new HoudiniClient(fetchQuery)
