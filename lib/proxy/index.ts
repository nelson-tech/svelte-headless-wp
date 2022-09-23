import type { RequestHandler } from "@sveltejs/kit"
import buildHeaders from "./buildHeaders"
import setCookies from "./setCookies"

const proxy: RequestHandler = async (event) => {
	const { request } = event

	const url = import.meta.env.VITE_API_URL
	const { headers, newToken, shouldLogout } = buildHeaders(request.headers)
	const body = await request.text()

	// let res: any = new Response(JSON.stringify({ empty: true }), {
	// 	headers: { "content-type": "application/json" },
	// })

	const res = await fetch(url, {
		method: "POST",
		credentials: "include",
		headers,
		body,
	}).catch((error) => {
		console.log("INDEX FETCH", error)
		return new Response("")
	})

	// Set cookies before returning
	const response = setCookies(res, newToken, shouldLogout)

	return response
}

export default proxy
