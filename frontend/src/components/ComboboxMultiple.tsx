import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from '@/components/ui/combobox'
import { Spinner } from './ui/spinner'

interface Props {
  data: { id: string; name: string }[]
  value: string[]
  setValue: (value: string[]) => void
  placeholder: string
  isLoading: boolean
}

export function ComboboxMultiple({
  data,
  value,
  setValue,
  placeholder,
  isLoading,
}: Props) {
  return (
    <Combobox items={data} multiple value={value} onValueChange={setValue}>
      <ComboboxChips>
        <ComboboxValue>
          {value.map((id) => {
            const item = data.find((d) => d.id === id)

            if (!item) return null

            return <ComboboxChip key={item.id}>{item.name}</ComboboxChip>
          })}
        </ComboboxValue>
        <ComboboxChipsInput placeholder={placeholder} disabled={isLoading} />
        {isLoading && <Spinner />}
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item.id}>
              {item.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
