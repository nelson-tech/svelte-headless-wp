import { decodeToken } from "./decodeJwt"

export const isTokenValid = (token: string | null | undefined): boolean => {
	if (typeof token === "string") {
		const tokenData = decodeToken(token)
		const now = Date.now()
		const expiration = tokenData?.exp ? tokenData.exp * 1000 : now

		if (expiration - now > 1000) {
			return true
		}
	}

	return false
}
