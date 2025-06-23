// components/PaypalButton.tsx
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PaypalButton = ({
  amount,
  onSuccess,
}: {
  amount: number;
  onSuccess: () => void;
}) => {
  return (
    <PayPalScriptProvider options={{ 'client-id': 'Ac9L7lg7BdYphgiEhHaUNzm3ns96rJT9yE2PzWNJDS4JspgK8BkN0XFrJJH_sg8-u28YxuN9Lnj5WbMe' }}>
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount.toString() } }],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order!.capture().then(() => {
            onSuccess(); // déclenche action après paiement
          });
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
