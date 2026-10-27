import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from './ui/badge'

interface Props {
  value: boolean | null
  setValue: (value: boolean | null) => void
}

export function SelectIsActive({ value, setValue }: Props) {
  return (
    <Select
      value={value === null ? 'all' : String(value)}
      onValueChange={(val) => {
        setValue(val === 'all' ? null : val === 'true')
      }}
    >
      <SelectTrigger className="w-37.5">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem value="true">
          <Badge variant="green">Active</Badge>
        </SelectItem>
        <SelectItem value="false">
          <Badge variant="secondary">Inactive</Badge>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
