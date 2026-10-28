import { useTable } from '@tanstack/react-table'
import type { ColumnDef, RowData, SortingState } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { features } from '#/components/ui/data-table/data-table-features'
import type { DataTableFeatures } from '#/components/ui/data-table/data-table-features'
import { useState } from 'react'
import { Spinner } from '../spinner'

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  isLoading: boolean
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24">
              <div className="w-full flex justify-center">
                <Spinner />
              </div>
            </TableCell>
          </TableRow>
        ) : (
          <>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </>
        )}
      </TableBody>
    </Table>
  )
}
