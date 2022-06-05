import { serialize } from "cookie"
import type { CookieSerializeOptions } from "cookie"

import { dev } from "$app/env"
import { WOO_SESSION_KEY } from "$wp/lib/constants"

const setCookies = async (res: Response) => {
	let cookies: string[] = []
	const expires = new Date()
	expires.setDate(expires.getDate() + 7)
	const cookieOptions: CookieSerializeOptions = {
		expires,
		maxAge: 2592000,
		httpOnly: true,
		secure: !dev,
		path: "/api",
	}

	// Cart session
	const wooSession = res.headers.get("woocommerce-session")

	if (wooSession) {
		const wooCookie = serialize(WOO_SESSION_KEY, wooSession, cookieOptions)
		cookies.push(wooCookie)
	}

	if (cookies.length > 0) {
		console.log("COOKIES", cookies)
		res.headers.set("set-cookie", String(cookies))
	}

	return res
}

export default setCookies
