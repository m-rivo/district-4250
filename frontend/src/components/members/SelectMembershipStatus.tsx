import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { MembershipStatus } from '#/types/member'
import { MEMBERSHIP_STATUSES } from '#/lib/schemas/member.schemas'

interface Props {
  value: MembershipStatus | null
  setValue: (value: MembershipStatus | null) => void
}

export function SelectMembershipStatus({ value, setValue }: Props) {
  return (
    <Select
      value={value ?? 'all'}
      onValueChange={(val) => {
        setValue(val === 'all' ? null : (val as MembershipStatus))
      }}
    >
      <SelectTrigger className="w-37.5">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>

        {MEMBERSHIP_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
