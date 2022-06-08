import { dev } from "$app/env"
import { KitQLClient } from "@kitql/client"

export type AppHeaders = {
	Authorization?: `Bearer ${string}`
	"woocommerce-session"?: `Session ${string}`
}

export const kitQLClient = new KitQLClient<AppHeaders>({
	url: false ? "/api/graphql" : import.meta.env.VITE_API_URL,
	credentials: "include",
	headersContentType: "application/json",
	// logType: ["client", "server", "operationAndvariables"],
})

// Get
// kitQLClient.getHeaders()

// Set
// kitQLClient.setHeaders({ Authorization: 'Bearer MY_TOKEN' })
