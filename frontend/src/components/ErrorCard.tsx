import { CardContent, Card } from '#/components/ui/card'
import { CircleXIcon } from 'lucide-react'

export default function ErrorCard({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <CircleXIcon className="size-9" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p role="alert" className="text-sm text-muted-foreground">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
