// src/providers/index.jsx
import { AuthProvider } from '@/contexts/AuthContext';
import { FertilizerProvider } from '@/contexts/FertilizerContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { SupportProvider } from '@/contexts/SupportContext';

export const AppProviders = ({ children }) => (
  <AuthProvider>
    <OrderProvider>
      <PaymentProvider>
        <FertilizerProvider>
          <SupportProvider>
            {children}
          </SupportProvider>
        </FertilizerProvider>
      </PaymentProvider>
    </OrderProvider>
  </AuthProvider>
);