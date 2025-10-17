import { Alert, AlertTitle } from '@mui/material';

type Props = {
  shopName: string;
  shopPhone: string;
};

export function AlertCustomers({ shopName, shopPhone }: Props) {
  return (
    <Alert variant="standard" sx={{ mb: 2 }} severity="info">
      <AlertTitle>Fiiro gaar ah</AlertTitle>
      Waxaad si toos ah ula macaamilaysaa <strong>{shopName}</strong>. Wixii caawinaad ah fadlan
      toos u wac <strong>{shopPhone}</strong>.
    </Alert>
  );
}
