export const exportToCSV = (data, columns, filename = 'export.csv') => {
  const headers = columns.map((c) => c.header).join(',');
  const rows = data
    .map((row) =>
      columns
        .map((col) => {
          const val = col.accessor(row);
          const str = val == null ? '' : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(',')
    )
    .join('\n');
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportToExcel = (data, columns, filename = 'export.xlsx') => {
  const headers = columns.map((c) => c.header);
  const rows = data.map((row) => columns.map((col) => col.accessor(row)));
  const tsv = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
  const blob = new Blob([tsv], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename.endsWith('.xlsx') ? filename : `${filename}.xls`;
  link.click();
  URL.revokeObjectURL(link.href);
};
