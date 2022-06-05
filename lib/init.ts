import { kitQLClient } from "../client"
import { KQL__Init } from "$lib/api/graphql/stores"
import { getSessionToken } from "./utils"

const apiInit = () => {
	KQL__Init()

	const currentHeaders = kitQLClient.getHeaders()

	let headers = currentHeaders

	const session = getSessionToken()
	if (session) {
		headers["woocommerce-session"] = `Session ${session}`
	}

	if (currentHeaders !== headers) {
		kitQLClient.setHeaders(headers)
	}
}

export default apiInit
