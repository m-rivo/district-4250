import * as XLSX from 'xlsx-js-style'

interface ExcelColumn<T> {
  header: string
  key: keyof T
  width?: number
  format?: (value: T[keyof T], row: T) => string | number
}

interface ExportExcelOptions<T> {
  data: T[]
  columns: ExcelColumn<T>[]
  fileName: string
  sheetName?: string
  title?: string
}

export function exportToExcel<T extends object>({
  data,
  columns,
  fileName,
  sheetName = 'Datos',
  title,
}: ExportExcelOptions<T>) {
  const headers = columns.map((column) => column.header)

  const rows = data.map((item) =>
    columns.map((column) => {
      const value = item[column.key]
      return column.format ? column.format(value, item) : (value ?? '')
    }),
  )

  const worksheet = XLSX.utils.aoa_to_sheet(
    title ? [[title], [], headers, ...rows] : [headers, ...rows],
  )

  const headerRow = title ? 2 : 0
  const dataStartRow = headerRow + 1

  // Título
  if (title) {
    worksheet['A1'].s = {
      font: { bold: true, sz: 16, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: 'D41367' } },
      alignment: { vertical: 'center' },
    }

    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
    ]

    worksheet['!rows'] = [{ hpt: 30 }, { hpt: 10 }]
  }

  // Encabezados
  columns.forEach((_column, colIndex) => {
    const cellAddress = XLSX.utils.encode_cell({
      r: headerRow,
      c: colIndex,
    })

    worksheet[cellAddress].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: 'D41367' } },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true,
      },
      border: {
        bottom: { style: 'medium', color: { rgb: '6B1234' } },
      },
    }
  })

  // Celdas de datos
  rows.forEach((row, rowIndex) => {
    row.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({
        r: dataStartRow + rowIndex,
        c: colIndex,
      })

      worksheet[cellAddress].s = {
        font: { color: { rgb: '333333' } },
        fill: {
          fgColor: {
            rgb: rowIndex % 2 === 0 ? 'FFFFFF' : 'FCE7F3',
          },
        },
        alignment: { vertical: 'center' },
        border: {
          bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
        },
      }
    })
  })

  // Ancho de columnas
  worksheet['!cols'] = columns.map((column) => ({
    wch: column.width ?? 20,
  }))

  worksheet['!autofilter'] = {
    ref: XLSX.utils.encode_range({
      s: { r: headerRow, c: 0 },
      e: {
        r: headerRow + rows.length,
        c: columns.length - 1,
      },
    }),
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}
