import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Region } from '#/types/region'
import { REGIONS } from '#/types/region'

interface SelectRegionProps {
  value: Region
  setValue: (value: Region) => void
  onBlur?: () => void
}

export function SelectRegion({ value, setValue, onBlur }: SelectRegionProps) {
  return (
    <Select value={value} onValueChange={(val) => setValue(val as Region)}>
      <SelectTrigger onBlur={onBlur}>
        <SelectValue placeholder="Select region" />
      </SelectTrigger>
      <SelectContent>
        {REGIONS.map((region) => (
          <SelectItem key={region} value={region}>
            {region}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
