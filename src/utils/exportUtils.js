import * as XLSX from 'xlsx';

export const exportToCSV = (
  data,
  columns,
  filename = 'export.csv'
) => {
  const rows = data.map((row) => {
    const obj = {};

    columns.forEach((col) => {
      const value =
        typeof col.accessor === 'function'
          ? col.accessor(row)
          : (row[col.key] ?? '');

      obj[col.header] =
        value == null ? '' : value;
    });

    return obj;
  });

  const worksheet =
    XLSX.utils.json_to_sheet(rows);

  const csv =
    XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  });

  const link =
    document.createElement('a');

  link.href =
    URL.createObjectURL(blob);

  link.download = filename.endsWith(
    '.csv'
  )
    ? filename
    : `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(link.href);
};

export const exportToExcel = (
  data,
  columns,
  filename = 'export.xlsx'
) => {
  const rows = data.map((row) => {
    const obj = {};

    columns.forEach((col) => {
      const value =
        typeof col.accessor === 'function'
          ? col.accessor(row)
          : (row[col.key] ?? '');

      obj[col.header] =
        value == null ? '' : value;
    });

    return obj;
  });

  const worksheet =
    XLSX.utils.json_to_sheet(rows);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Sheet1'
  );

  XLSX.writeFile(
    workbook,
    filename.endsWith('.xlsx')
      ? filename
      : `${filename}.xlsx`
  );
};