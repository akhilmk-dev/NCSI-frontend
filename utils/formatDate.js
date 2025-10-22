export const formatDate = (dateStr, locale = 'en-EG') => {
  const date = new Date(dateStr);
  const day = date.getDate(); // Always English digits
  const year = date.getFullYear();

  const month =
    locale === 'ar-EG'
      ? date.toLocaleString('ar-EG', { month: 'long' })    // Arabic month
      : date.toLocaleString(locale, { month: 'long' });    // English month

  return `${day} ${month}, ${year}`;
};
