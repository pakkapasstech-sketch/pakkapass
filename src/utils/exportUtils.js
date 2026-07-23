import * as XLSX from 'xlsx';

export const exportToCSV = (
  data,
  columns,
  filename = 'export.csv',
  summaryData = null
) => {
  let worksheet;

  if (summaryData && Array.isArray(summaryData) && summaryData.length > 0) {
    const wsData = [];

    wsData.push(['Summary Metric', 'Value']);
    summaryData.forEach((item) => {
      wsData.push([item.label, item.value]);
    });
    wsData.push([]); // Empty row separator

    const headers = columns.map((col) => col.header);
    wsData.push(headers);

    data.forEach((row) => {
      const rowValues = columns.map((col) => {
        const value =
          typeof col.accessor === 'function'
            ? col.accessor(row)
            : (row[col.key] ?? '');
        return value == null ? '' : value;
      });
      wsData.push(rowValues);
    });

    worksheet = XLSX.utils.aoa_to_sheet(wsData);
  } else {
    const rows = data.map((row) => {
      const obj = {};
      columns.forEach((col) => {
        const value =
          typeof col.accessor === 'function'
            ? col.accessor(row)
            : (row[col.key] ?? '');
        obj[col.header] = value == null ? '' : value;
      });
      return obj;
    });

    worksheet = XLSX.utils.json_to_sheet(rows);
  }

  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(link.href);
};

export const exportToExcel = (
  data,
  columns,
  filename = 'export.xlsx',
  summaryData = null
) => {
  let worksheet;

  if (summaryData && Array.isArray(summaryData) && summaryData.length > 0) {
    const wsData = [];

    wsData.push(['Summary Metric', 'Value']);
    summaryData.forEach((item) => {
      wsData.push([item.label, item.value]);
    });
    wsData.push([]); // Empty row separator

    const headers = columns.map((col) => col.header);
    wsData.push(headers);

    data.forEach((row) => {
      const rowValues = columns.map((col) => {
        const value =
          typeof col.accessor === 'function'
            ? col.accessor(row)
            : (row[col.key] ?? '');
        return value == null ? '' : value;
      });
      wsData.push(rowValues);
    });

    worksheet = XLSX.utils.aoa_to_sheet(wsData);
  } else {
    const rows = data.map((row) => {
      const obj = {};
      columns.forEach((col) => {
        const value =
          typeof col.accessor === 'function'
            ? col.accessor(row)
            : (row[col.key] ?? '');
        obj[col.header] = value == null ? '' : value;
      });
      return obj;
    });

    worksheet = XLSX.utils.json_to_sheet(rows);
  }

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  XLSX.writeFile(
    workbook,
    filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
  );
};