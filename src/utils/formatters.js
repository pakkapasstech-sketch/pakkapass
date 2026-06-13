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
