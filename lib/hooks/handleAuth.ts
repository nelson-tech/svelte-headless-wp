import type { Handle } from "@sveltejs/kit"
import cookie from "cookie"

import { AUTH_ENDPOINT, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants"
import { isTokenValid } from "../validateToken"

export const handleAuth: Handle = async ({ event, resolve }) => {
	// Before endpoint call

	const { request, url } = event

	let refreshedToken: string | undefined = undefined
	let shouldLogout = false

	const cookies = cookie.parse(request.headers.get("cookie") || "")
	const authToken = cookies[AUTH_TOKEN_KEY]
	const refreshToken = cookies[REFRESH_TOKEN_KEY]

	// Skip auth check when using authentication endpoints
	if (!url.pathname.startsWith("/auth")) {
		if (!isTokenValid(authToken)) {
			// Auth token is invalid

			// Check if refreshToken available
			if (isTokenValid(refreshToken)) {
				// Try to get new auth token

				try {
					console.warn("Trying to refresh auth token.")

					const refreshResponse = await fetch(AUTH_ENDPOINT, {
						method: "POST",
						body: JSON.stringify({ action: "REFRESH", token: refreshToken }),
					})

					const refreshData = await refreshResponse.json()
					const newToken = refreshData?.refresh?.data?.refreshJwtAuthToken?.authToken

					// If new auth token, set it for response headers
					newToken ? (refreshedToken = newToken) : (shouldLogout = true)
				} catch (error) {
					// Error during
					console.warn("Error during token refresh attempt.", refreshToken)
				}
			} else {
				// Auth token is invalid
				// Refresh token is invalid
				shouldLogout = true
			}
		} else {
			// User is authorized
			// Put authToken into locals for endpoint to access

			event.locals.tokens = { ...event.locals.tokens, auth: authToken }
		}
	} else {
		// Going to auth endpoint

		// Put tokens into locals for endpoint to access

		event.locals.tokens = {
			...event.locals.tokens,
			auth: authToken ?? false,
			refresh: refreshToken ?? false,
		}
	}

	// Endpoint call
	const response = await resolve(event)

	// After endpoint call

	// If new auth token received, set cookie
	refreshedToken &&
		response.headers.append(
			"set-cookie",
			`${AUTH_TOKEN_KEY}=${refreshedToken}; HttpOnly; Path='/'; expires=${new Date(
				Date.now() + 15 * 60 * 1000,
			).toUTCString()}`,
		)

	// If shouldLogout, destroy tokens if they exist
	if (shouldLogout) {
		authToken &&
			response.headers.set(
				"set-cookie",
				`${AUTH_TOKEN_KEY}=deleted; Path='/'; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
			)
		refreshToken &&
			response.headers.append(
				"set-cookie",
				`${REFRESH_TOKEN_KEY}=deleted; Path='/'; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
			)
	}

	return response
}
