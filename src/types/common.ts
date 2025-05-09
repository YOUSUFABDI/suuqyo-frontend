import type { Dayjs } from 'dayjs';

// ----------------------------------------------------------------------

export type IDateValue = string | number | null;

export type IDatePickerControl = Dayjs | null;

export type ISocialLink = {
  twitter: string;
  facebook: string;
  linkedin: string;
  instagram: string;
};

export type IPaymentCard = {
  id: string;
  cardType: string;
  primary?: boolean;
  cardNumber: string;
};
