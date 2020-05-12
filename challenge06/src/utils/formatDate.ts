import { format, parseISO } from 'date-fns';

export default function formatDate(date: string): string {
  const dateFormatted = format(new Date(parseISO(date)), 'dd/MM/yyyy');

  return dateFormatted;
}
