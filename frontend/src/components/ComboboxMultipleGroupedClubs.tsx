import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
} from '@/components/ui/combobox'
import type { ClubListItem } from '#/types/club'
import { Spinner } from './ui/spinner'

interface Country {
  name: string
  clubs: { id: string; name: string }[]
}

interface Props {
  data: ClubListItem[]
  value: string[]
  setValue: (value: string[]) => void
  isLoading: boolean
}

export function ComboboxMultipleGroupedClubs({
  data,
  value,
  setValue,
  isLoading,
}: Props) {
  const countries = Object.values(
    data.reduce<Record<string, Country>>((acc, club) => {
      if (!acc[club.country]) {
        acc[club.country] = {
          name: club.country,
          clubs: [],
        }
      }

      acc[club.country].clubs.push(club)

      return acc
    }, {}),
  )

  return (
    <Combobox items={countries} multiple value={value} onValueChange={setValue}>
      <ComboboxChips>
        <ComboboxValue>
          {value.map((id) => {
            const club = data.find((d) => d.id === id)

            if (!club) return null

            return <ComboboxChip key={club.id}>{club.name}</ComboboxChip>
          })}
        </ComboboxValue>
        <ComboboxChipsInput placeholder="Clubs" disabled={isLoading} />
        {isLoading && <Spinner />}
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxEmpty>No clubs found.</ComboboxEmpty>
        <ComboboxList>
          {(country) => (
            <ComboboxGroup key={country.name} items={country.clubs}>
              <ComboboxLabel>{country.name}</ComboboxLabel>
              <ComboboxCollection>
                {(club) => (
                  <ComboboxItem key={club.id} value={club.id}>
                    {club.name}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
