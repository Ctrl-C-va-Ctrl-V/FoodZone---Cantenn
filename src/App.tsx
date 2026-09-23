import React, { useState } from 'react';
import { CanteenProvider, useCanteen } from './context/CanteenContext';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { UserProfileBanner } from './components/UserProfileBanner';
import { MenuBrowsing } from './components/StudentView/MenuBrowsing';
import { CartDrawer } from './components/StudentView/CartDrawer';
import { CheckoutModal } from './components/StudentView/CheckoutModal';
import { QRPaymentModal } from './components/StudentView/QRPaymentModal';
import { OrderHistoryView } from './components/StudentView/OrderHistoryView';
import { KitchenDashboard } from './components/StaffView/KitchenDashboard';
import { StockManagementView } from './components/StaffView/StockManagementView';
import { RevenueAnalytics } from './components/AdminView/RevenueAnalytics';
import { DishRatingsView } from './components/AdminView/DishRatingsView';
import { MenuManagementView } from './components/AdminView/MenuManagementView';
import { Footer } from './components/Footer';
import { PaymentMethod, Order } from './types';

const MainApp: React.FC = () => {
  const { activeView, setActiveView, isAuthenticated } = useCanteen();

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isQRPaymentOpen, setIsQRPaymentOpen] = useState(false);

  // Staged order data for QR payment modal
  const [pendingOrderPayload, setPendingOrderPayload] = useState<{
    studentName: string;
    studentPhone: string;
    deliveryArea: string;
    detailedAddress: string;
    paymentMethod: PaymentMethod;
    studentNotes?: string;
    totalAmount: number;
  } | null>(null);

  // If user is not logged in, show the dedicated LoginPage directly
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleOpenQRPayment = (orderData: {
    studentName: string;
    studentPhone: string;
    deliveryArea: string;
    detailedAddress: string;
    paymentMethod: PaymentMethod;
    studentNotes?: string;
    totalAmount: number;
  }) => {
    setPendingOrderPayload(orderData);
    setIsQRPaymentOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setIsQRPaymentOpen(false);
    setPendingOrderPayload(null);
    // Switch to order history to see the newly placed order live!
    setActiveView('orders');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Navigation Header */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {/* User Identity & Profile Ribbon */}
        <UserProfileBanner />

        {/* Dynamic Views rendering based on logged-in role & active view */}
        {activeView === 'menu' && (
          <MenuBrowsing onOpenCart={() => setIsCartOpen(true)} filterOnlyCombos={false} />
        )}

        {activeView === 'combos' && (
          <MenuBrowsing onOpenCart={() => setIsCartOpen(true)} filterOnlyCombos={true} />
        )}

        {activeView === 'orders' && <OrderHistoryView />}

        {activeView === 'kitchen' && <KitchenDashboard />}

        {activeView === 'stock' && <StockManagementView />}

        {activeView === 'analytics' && <RevenueAnalytics />}

        {activeView === 'reviews' && <DishRatingsView />}

        {activeView === 'menu-management' && <MenuManagementView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOpenQRPayment={handleOpenQRPayment}
      />

      {/* QR Payment Modal */}
      <QRPaymentModal
        isOpen={isQRPaymentOpen}
        onClose={() => setIsQRPaymentOpen(false)}
        orderData={pendingOrderPayload}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default function App() {
  return (
    <CanteenProvider>
      <MainApp />
    </CanteenProvider>
  );
}
