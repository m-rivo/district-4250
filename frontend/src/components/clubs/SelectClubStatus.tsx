import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ClubStatus } from '#/types/club'
import { CLUB_STATUSES } from '#/lib/schemas/club.schemas'

interface SelectClubStatusProps {
  value: ClubStatus
  setValue: (value: ClubStatus) => void
  onBlur?: () => void
}

export function SelectClubStatus({
  value,
  setValue,
  onBlur,
}: SelectClubStatusProps) {
  return (
    <Select value={value} onValueChange={(val) => setValue(val as ClubStatus)}>
      <SelectTrigger onBlur={onBlur}>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {CLUB_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
