import { setSessionToken } from "./lib/utils"

const enhancedFetch = async (
	input: RequestInfo,
	init?: RequestInit | undefined,
): Promise<Response> => {
	const response = await fetch(input, init)
	setSessionToken(response.headers.get("woocommerce-session"))
	return response
}

export default enhancedFetch
