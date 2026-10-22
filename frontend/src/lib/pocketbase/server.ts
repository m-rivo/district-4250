import '@tanstack/react-start/server-only'
import PocketBase from 'pocketbase'

export function createServerPocketBase() {
  const url = process.env.POCKETBASE_URL

  if (!url) {
    throw new Error('Missing POCKETBASE_URL environment variable')
  }

  return new PocketBase(url)
}
