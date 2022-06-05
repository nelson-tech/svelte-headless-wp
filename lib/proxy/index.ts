import type { RequestHandler } from "@sveltejs/kit"
import buildHeaders from "./buildHeaders"
import setCookies from "./setCookies"

const proxy: RequestHandler = async (event) => {
	const { request } = event

	const res = await fetch(import.meta.env.VITE_API_URL, {
		method: "POST",
		credentials: "include",
		headers: buildHeaders(request.headers),
		body: await request.text(),
	})

	// Set cookies before returning

	return await setCookies(res)
}

export default proxy
