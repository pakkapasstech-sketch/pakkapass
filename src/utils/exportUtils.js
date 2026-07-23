import XLSX from 'xlsx-js-style';

const applyStylesToWorksheet = (worksheet, hasSummary, summaryLength) => {
  if (!worksheet || !worksheet['!ref']) return;

  const range = XLSX.utils.decode_range(worksheet['!ref']);
  const cols = [];

  for (let C = range.s.c; C <= range.e.c; ++C) {
    cols[C] = 14;
  }

  const summaryHeaderRow = hasSummary ? 0 : -1;
  const summaryStartRow = hasSummary ? 1 : -1;
  const summaryEndRow = hasSummary ? summaryLength : -1;
  const tableHeaderRow = hasSummary ? summaryLength + 1 : 0;
  const dataStartRow = tableHeaderRow + 1;

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      let cell = worksheet[cellAddress];

      if (!cell) {
        cell = { v: '', t: 's' };
        worksheet[cellAddress] = cell;
      }

      const valStr = cell.v != null ? String(cell.v) : '';
      if (valStr.length + 5 > (cols[C] || 14)) {
        cols[C] = Math.min(valStr.length + 5, 55);
      }

      const defaultBorder = {
        top: { style: 'thin', color: { rgb: 'E5E7EB' } },
        bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
        left: { style: 'thin', color: { rgb: 'E5E7EB' } },
        right: { style: 'thin', color: { rgb: 'E5E7EB' } },
      };

      if (R === summaryHeaderRow) {
        cell.s = {
          font: { name: 'Segoe UI', sz: 11, bold: true, color: { rgb: '111827' } },
          fill: { fgColor: { rgb: 'F3F4F6' } },
          alignment: { horizontal: 'left', vertical: 'center' },
          border: {
            top: { style: 'medium', color: { rgb: '9CA3AF' } },
            bottom: { style: 'medium', color: { rgb: '9CA3AF' } },
            left: { style: 'thin', color: { rgb: 'E5E7EB' } },
            right: { style: 'thin', color: { rgb: 'E5E7EB' } },
          },
        };
      } else if (R >= summaryStartRow && R <= summaryEndRow) {
        const isLabel = C === 0;
        cell.s = {
          font: { name: 'Segoe UI', sz: 10, bold: isLabel, color: { rgb: '1F2937' } },
          fill: { fgColor: { rgb: 'FFFFFF' } },
          alignment: { horizontal: isLabel ? 'left' : 'right', vertical: 'center' },
          border: defaultBorder,
        };
      } else if (R === tableHeaderRow) {
        cell.s = {
          font: { name: 'Segoe UI', sz: 11, bold: true, color: { rgb: '111827' } },
          fill: { fgColor: { rgb: 'FFFFFF' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'medium', color: { rgb: '9CA3AF' } },
            bottom: { style: 'medium', color: { rgb: '9CA3AF' } },
            left: { style: 'thin', color: { rgb: 'E5E7EB' } },
            right: { style: 'thin', color: { rgb: 'E5E7EB' } },
          },
        };
      } else if (R >= dataStartRow) {
        const isEven = (R - dataStartRow) % 2 === 0;
        const rowBg = isEven ? 'FFFFFF' : 'F9FAFB';

        const statusVal = String(cell.v).trim();
        let fontColor = '1F2937';
        let fontBold = false;

        if (statusVal === 'Active' || statusVal === 'Success' || statusVal === 'Paid') {
          fontColor = '059669';
          fontBold = true;
        } else if (statusVal === 'Inactive' || statusVal === 'Failed' || statusVal === 'Suspended') {
          fontColor = 'DC2626';
          fontBold = true;
        } else if (statusVal === 'Pending') {
          fontColor = 'D97706';
          fontBold = true;
        }

        cell.s = {
          font: { name: 'Segoe UI', sz: 10, bold: fontBold, color: { rgb: fontColor } },
          fill: { fgColor: { rgb: rowBg } },
          alignment: { horizontal: 'left', vertical: 'center' },
          border: defaultBorder,
        };
      }
    }
  }

  worksheet['!cols'] = cols.map((w) => ({ wch: w }));
};

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
    wsData.push([]);

    const headers = columns.map((col) => col.header);
    wsData.push(headers);

    data.forEach((row, index) => {
      const rowValues = columns.map((col) => {
        const value =
          typeof col.accessor === 'function'
            ? col.accessor(row, index)
            : (row[col.key] ?? '');
        return value == null ? '' : value;
      });
      wsData.push(rowValues);
    });

    worksheet = XLSX.utils.aoa_to_sheet(wsData);
  } else {
    const rows = data.map((row, index) => {
      const obj = {};
      columns.forEach((col) => {
        const value =
          typeof col.accessor === 'function'
            ? col.accessor(row, index)
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
  const hasSummary = summaryData && Array.isArray(summaryData) && summaryData.length > 0;
  const summaryLength = hasSummary ? summaryData.length : 0;

  if (hasSummary) {
    const wsData = [];

    wsData.push(['Summary Metric', 'Value']);
    summaryData.forEach((item) => {
      wsData.push([item.label, item.value]);
    });
    wsData.push([]);

    const headers = columns.map((col) => col.header);
    wsData.push(headers);

    data.forEach((row, index) => {
      const rowValues = columns.map((col) => {
        const value =
          typeof col.accessor === 'function'
            ? col.accessor(row, index)
            : (row[col.key] ?? '');
        return value == null ? '' : value;
      });
      wsData.push(rowValues);
    });

    worksheet = XLSX.utils.aoa_to_sheet(wsData);
  } else {
    const rows = data.map((row, index) => {
      const obj = {};
      columns.forEach((col) => {
        const value =
          typeof col.accessor === 'function'
            ? col.accessor(row, index)
            : (row[col.key] ?? '');
        obj[col.header] = value == null ? '' : value;
      });
      return obj;
    });

    worksheet = XLSX.utils.json_to_sheet(rows);
  }

  applyStylesToWorksheet(worksheet, hasSummary, summaryLength);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  XLSX.writeFile(
    workbook,
    filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
  );
};