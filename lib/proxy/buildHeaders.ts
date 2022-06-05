import { parse } from "cookie"

import { WOO_SESSION_KEY } from "$wp/lib/constants"

const buildHeaders = (headers: Headers) => {
	//
	// Headers
	//
	const newHeaders: { [key: string]: string } = { Host: "api.nelson.tech" }
	headers.forEach((v, k) => (newHeaders[k] = v))

	//
	// Cookies
	//
	const clientCookies = parse(headers.get("cookie") || "")

	// Authorization

	// WooCommerce
	const wooCookie = clientCookies[WOO_SESSION_KEY]
	wooCookie && (newHeaders["woocommerce-session"] = `Session ${wooCookie}`)

	return newHeaders
}

export default buildHeaders
