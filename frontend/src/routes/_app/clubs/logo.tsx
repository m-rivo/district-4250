import { createFileRoute } from '@tanstack/react-router'
import { createServerPocketBase } from '#/lib/pocketbase/server'

export const Route = createFileRoute('/_app/clubs/logo')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData()

          const id = formData.get('id')
          const picture = formData.get('logo')

          if (typeof id !== 'string' || !(picture instanceof File)) {
            return Response.json(
              { error: 'Invalid upload data' },
              { status: 400 },
            )
          }

          const pb = createServerPocketBase()

          await pb.collection('clubs').update(id, {
            logo: picture,
          })

          return Response.json({ success: true })
        } catch (error) {
          console.error('Logo upload failed:', error)

          return Response.json({ error: 'Upload failed' }, { status: 500 })
        }
      },
    },
  },
})
