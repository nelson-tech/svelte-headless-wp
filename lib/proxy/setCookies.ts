import { serialize } from "cookie"
import type { CookieSerializeOptions } from "cookie"

import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, WOO_SESSION_KEY } from "$wp/lib/constants"

const setCookies = async (
	res: Response,
	authToken: string | null | undefined,
	logout: boolean = false,
) => {
	let cookies: string[] = []
	const newHeaders = new Headers(res.headers)

	const cartExpires = new Date()
	cartExpires.setDate(cartExpires.getDate() + 7)
	const cookieOptions: CookieSerializeOptions = {
		maxAge: 2592000,
		httpOnly: true,
		secure: true,
		path: "/",
	}

	// Cart session
	try {
		const wooSession = res.headers.get("woocommerce-session")

		if (wooSession) {
			const wooCookie = serialize(WOO_SESSION_KEY, wooSession, {
				...cookieOptions,
				expires: cartExpires,
			})
			cookies.push(wooCookie)
		}
	} catch (error) {
		console.log("Error handling cart session", error)
	}

	// Auth Token
	if (authToken) {
		const authCookie = serialize(AUTH_TOKEN_KEY, authToken, {
			...cookieOptions,
			expires: new Date(Date.now() + 15 * 60 * 1000),
		})
		cookies.push(authCookie)
	}

	if (logout) {
		const authToken = `${AUTH_TOKEN_KEY}=deleted; Path='/'; expires=Thu, 01 Jan 1970 00:00:00 GMT`
		const refreshToken = `${REFRESH_TOKEN_KEY}=deleted; Path='/'; expires=Thu, 01 Jan 1970 00:00:00 GMT`

		newHeaders.set("set-cookie", String([authToken, refreshToken]))
	} else {
		if (cookies.length > 0) {
			newHeaders.set("set-cookie", String(cookies))
		}
	}

	const response = new Response(res.body, { headers: newHeaders })

	return response
}

export default setCookies
