import { parse } from "cookie"

import { AUTH_TOKEN_KEY, SHOULD_LOGOUT_KEY, WOO_SESSION_KEY } from "$wp/lib/constants"
// import handleAuth from "./handleAuth"

const buildHeaders = (headers: Headers) => {
	//
	// Host
	//
	headers.delete("host")
	const newHeaders: { [key: string]: string } = { host: import.meta.env.VITE_API_HOST }
	headers.forEach((v, k) => (newHeaders[k] = v))

	//
	// Cookies
	//
	const clientCookies = parse(headers.get("cookie") || "")

	// WooCommerce
	const wooCookie = clientCookies[WOO_SESSION_KEY]
	wooCookie && (newHeaders["woocommerce-session"] = `Session ${wooCookie}`)

	// Auth
	// const newToken = await handleAuth(clientCookies)
	// const authToken = newToken ?? clientCookies[AUTH_TOKEN_KEY]
	// authToken && (newHeaders["Authorization"] = `Bearer ${authToken}`)

	// Logout
	// const shouldLogout = clientCookies[SHOULD_LOGOUT_KEY] === "true"

	return { headers: newHeaders, newToken: null, shouldLogout: false }
}

export default buildHeaders
