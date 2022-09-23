import { browser } from "$app/environment"

import { WOO_SESSION_KEY } from "./constants"

export const getSessionToken = () => {
	if (browser) {
		const session = localStorage.getItem(WOO_SESSION_KEY)
		return session
	}
	return null
}

export const setSessionToken = (session: string | null) => {
	if (browser && session) {
		localStorage.setItem(WOO_SESSION_KEY, session)
	}
}
