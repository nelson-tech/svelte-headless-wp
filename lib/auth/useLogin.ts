import { browser } from "$app/environment"

import { CachePolicy, GQL_GetCurrentUser, GQL_LoginUser, type LoginUser$result } from "$houdini"
import type { LoginType } from "../authEndpoint"

export const setTokenCookie = async (loginData: LoginUser$result["login"]) => {
	if (browser) {
		const tokens: LoginType["tokens"] = {
			auth: loginData?.user?.jwtAuthToken,
			refresh: loginData?.user?.jwtRefreshToken,
		}

		const body: LoginType = { action: "LOGIN", tokens }
		await fetch("/auth", {
			method: "POST",
			body: JSON.stringify(body),
		}).catch((e) => {
			console.error("setTokenCookie", e)

			// TODO - Handle Error
		})
	}
}

type UseLoginInputType = {
	username: string
	password: string
}

export const useLogin = async (input: UseLoginInputType) => {
	const response = await GQL_LoginUser.mutate({ input })
		.then(async (r) => {
			const data = r
			if (data?.login?.user?.jwtAuthToken) {
				await setTokenCookie(data.login)
				await GQL_GetCurrentUser.fetch({ policy: CachePolicy.NetworkOnly })
				return data.login.user
			}
			return false
		})
		.catch((e) => {
			console.error("Error logging in", e, input)

			// TODO: Handle error
			return false
		})

	return response
}
