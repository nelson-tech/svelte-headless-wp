import { KitQLClient } from "@kitql/client"

export type AppHeaders = {
	Authorization?: `Bearer ${string}`
	"woocommerce-session"?: `Session ${string}`
}

export const kitQLClient = new KitQLClient<AppHeaders>({
	url: "/api/graphql",
	credentials: "include",
	headersContentType: "application/json",
	// logType: ["client", "server", "operationAndvariables"],
})

// Get
// kitQLClient.getHeaders()

// Set
// kitQLClient.setHeaders({ Authorization: 'Bearer MY_TOKEN' })
