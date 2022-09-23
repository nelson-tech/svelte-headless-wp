import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants"
import { isTokenValid } from "../validateToken"

const handleAuth = async (cookies: Record<string, string>) => {
	const authToken = cookies[AUTH_TOKEN_KEY]
	const refreshToken = cookies[REFRESH_TOKEN_KEY]

	let newToken: string | null | undefined

	if (!isTokenValid(authToken)) {
		// Auth token is invalid

		// Check if refreshToken available
		if (isTokenValid(refreshToken)) {
			// Try to get new auth token

			try {
				console.warn("Trying to refresh auth token.")

				const query = {
					query: `mutation RefreshAuthToken {\n  refreshJwtAuthToken(input: {jwtRefreshToken: "${refreshToken}"}) {\n    authToken\n  }\n}\n`,
					variables: {},
				}
				const data = await fetch(import.meta.env.VITE_API_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(query),
				})

				const refreshData = await data.json()
				const refreshedToken = refreshData?.refresh?.data?.refreshJwtAuthToken?.authToken

				// If new auth token, set it for response headers
				refreshedToken && (newToken = refreshToken)
			} catch (error) {
				// Error during
				console.warn("Error during token refresh attempt.", error)
			}
		} else {
			// Auth token is invalid
			// Refresh token is invalid
		}
	}

	return newToken
}

export default handleAuth
