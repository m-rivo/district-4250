import PocketBase from 'pocketbase'

const apiUrl = import.meta.env.VITE_API_URL

export const pb = new PocketBase(apiUrl)
