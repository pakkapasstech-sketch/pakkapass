export const formatNumber = (num) =>
  new Intl.NumberFormat('en-IN').format(typeof num === 'string' ? parseFloat(num) : num);

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    amount
  );

  export const formatDate = (date) => {
    if (!date) return '-';
  
    const parsedDate = new Date(date);
  
    if (isNaN(parsedDate.getTime())) {
      return '-';
    }
  
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(parsedDate);
  };

export const getInitials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export const formatFileSize = (size) => {
  if (size === null || size === undefined || size === '') return '-';
  // If it's already a formatted string like "2.4 MB" or "900 KB", return it as is
  if (typeof size === 'string' && /[a-zA-Z]/.test(size)) {
    return size;
  }
  const bytes = Number(size);
  if (isNaN(bytes) || bytes < 0) return size;

  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

