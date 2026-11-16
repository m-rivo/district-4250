import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Country } from '#/types/country'
import { COUNTRIES } from '#/types/country'

interface SelectOneCountryProps {
  value: Country
  setValue: (value: Country) => void
  onBlur?: () => void
}

export function SelectOneCountry({
  value,
  setValue,
  onBlur,
}: SelectOneCountryProps) {
  return (
    <Select value={value} onValueChange={(val) => setValue(val as Country)}>
      <SelectTrigger onBlur={onBlur}>
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((country) => (
          <SelectItem key={country} value={country}>
            {country}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
