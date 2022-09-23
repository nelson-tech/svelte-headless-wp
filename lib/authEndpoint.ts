import type { RequestHandler } from "@sveltejs/kit"

import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "$wp/lib/constants"
import { decodeToken } from "$wp/lib/decodeJwt"

export type LoginType = {
	action: "LOGIN"
	tokens?: {
		auth?: string | null | undefined
		refresh?: string | null | undefined
	}
}

type RefreshType = {
	action: "REFRESH"
	token: string
}

type LogoutType = {
	action: "LOGOUT"
}

type ResponseBody = {
	from: string
	token?: any
	refresh?: any
	authToken?: string | null
}

type DataType = LoginType | RefreshType | LogoutType

export const POST: RequestHandler = async ({ request, locals }) => {
	const data = (await request.json()) as DataType

	const headers = new Headers()

	let body: ResponseBody = { from: "/auth" }

	switch (data.action) {
		case "LOGIN":
			const tokens = data?.tokens || null

			tokens?.auth &&
				headers.append(
					"set-cookie",
					`${AUTH_TOKEN_KEY}=${tokens.auth}; HttpOnly; Path='/'; expires=${new Date(
						Date.now() + 15 * 60 * 1000,
					).toUTCString()}`,
				)

			if (tokens?.refresh) {
				const refreshExp = new Date(decodeToken(tokens.refresh).exp * 1000).toUTCString()

				refreshExp &&
					headers.append(
						"set-cookie",
						`${REFRESH_TOKEN_KEY}=${tokens.refresh}; HttpOnly; Path='/'; expires=${refreshExp}`,
					)
			}
			break

		case "REFRESH":
			const token = locals.tokens?.refresh || data.token || undefined

			if (token) {
				const query = {
					query: `mutation RefreshAuthToken {\n  refreshJwtAuthToken(input: {jwtRefreshToken: "${token}"}) {\n    authToken\n  }\n}\n`,
					variables: {},
				}
				const response = await fetch(import.meta.env.VITE_API_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(query),
				})

				body.refresh = await response.json()
			}

			break
		case "LOGOUT":
			headers.set(
				"set-cookie",
				`${AUTH_TOKEN_KEY}=deleted; Path='/'; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
			)
			headers.append(
				"set-cookie",
				`${REFRESH_TOKEN_KEY}=deleted; Path='/'; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
			)
			break
		default:
			// Just checking auth state

			const authToken = locals.tokens?.auth

			authToken ? (body.authToken = authToken) : (body.authToken = null)
			break
	}

	const response = new Response(JSON.stringify(body), { headers })

	return response
}
