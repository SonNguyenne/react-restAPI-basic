import moment from 'moment';

export const formatDateTime = (
  value: string | undefined,
  format = 'DD/MM/YYYY',
) => {
  if (!value) return '';
  return moment(value).format(format);
};
