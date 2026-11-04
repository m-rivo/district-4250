import { createFileRoute } from '@tanstack/react-router'
import { createServerPocketBase } from '#/lib/pocketbase/server'

export const Route = createFileRoute('/_app/members/profile-picture')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData()

          const id = formData.get('id')
          const picture = formData.get('profile_picture')

          if (typeof id !== 'string' || !(picture instanceof File)) {
            return Response.json(
              { error: 'Invalid upload data' },
              { status: 400 },
            )
          }

          const pb = createServerPocketBase()

          await pb.collection('members').update(id, {
            profile_picture: picture,
          })

          return Response.json({ success: true })
        } catch (error) {
          console.error('Profile picture upload failed:', error)

          return Response.json({ error: 'Upload failed' }, { status: 500 })
        }
      },
    },
  },
})
