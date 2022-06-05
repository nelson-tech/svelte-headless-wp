import type { RequestQueryParameters } from "@kitql/client"
import type { Load } from "@sveltejs/kit"
import type { Subscriber, Unsubscriber } from "svelte/store"

type ServerQueryInputType = {
	store: {
		subscribe: (this: void, run: Subscriber<any>, invalidate?: any) => Unsubscriber
		query: (params?: RequestQueryParameters<any> | undefined) => Promise<any>
		queryLoad: (params?: RequestQueryParameters<any> | undefined) => Promise<any>
		resetCache(variables?: any, allOperationKey?: boolean, withResetStore?: boolean): void
		patch(data: any, variables?: any, type?: any): void
	}
	variables?: any
}
type ServerQueryType = (input: ServerQueryInputType | ServerQueryInputType[]) => Load

/**
 * Accepts either an object with store and variables, or an array of objects.
 * @param input Object of {store: KitQL generated store, variables: (optional) Variables to pass to the query}
 * @returns load function which is a keyword for Svelte. Make sure to export it.
 */
const serverQuery: ServerQueryType = (input) => {
	const load: Load = async ({ fetch, stuff, session }) => {
		console.log("SESSION", session)

		if (Array.isArray(input)) {
			const queries = input.map(async (item) => {
				const { store, variables } = item
				await store.queryLoad({ fetch, variables })
			})
			await Promise.all(queries)
		} else {
			const { store, variables } = input
			await store.queryLoad({ fetch, variables })
		}
		return {}
	}
	return load
}

export default serverQuery
