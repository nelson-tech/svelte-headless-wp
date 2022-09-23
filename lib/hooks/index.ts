import { sequence } from "@sveltejs/kit/hooks"

import { handleAuth } from "./handleAuth"

export const handle = sequence(handleAuth)
