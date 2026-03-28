import { Check, CreditCard, Landmark, Banknote, MapPin, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import OrderSummary from '@/components/order/OrderSummary';
import ROUTES from '@/constants/routes';
import useCart from '@/hooks/useCart';
import useOrders from '@/hooks/useOrders';
import { addToast } from '@/store/slices/uiSlice';
import formatCurrency from '@/utils/formatCurrency';

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { cart, isLoading: cartLoading } = useCart();
  const { placeOrder } = useOrders();
  const [activeStep, setActiveStep] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);

  // Load saved addresses from localStorage
  useEffect(() => {
    try {
      const storageKey = `fk-saved-addresses-${user?.id || 'guest'}`;
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (stored.length > 0) {
        setSavedAddresses(stored);
        setShowAddressForm(false);
      }
    } catch { /* ignore */ }
  }, [user?.id]);

  if (cartLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="market-card rounded-[2px] p-10 text-center animate-fade-in-up">
        <h2 className="text-xl font-semibold text-slate-900">Your cart is empty</h2>
        <p className="mt-2 text-slate-500">Add some products before checking out.</p>
        <Button className="mt-6" onClick={() => navigate(ROUTES.products)}>
          Browse Products
        </Button>
      </div>
    );
  }

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    return (
      address.name &&
      address.phone &&
      address.line1 &&
      address.city &&
      address.state &&
      address.pincode &&
      /^\d{6}$/.test(address.pincode)
    );
  };

  const handleSaveAddress = () => {
    if (!validateAddress()) {
      dispatch(addToast({ variant: 'error', message: 'Please fill all required fields with valid values. Pincode must be 6 digits.' }));
      return;
    }

    const newAddresses = [...savedAddresses, { ...address }];
    setSavedAddresses(newAddresses);
    const storageKey = `fk-saved-addresses-${user?.id || 'guest'}`;
    localStorage.setItem(storageKey, JSON.stringify(newAddresses));
    setSelectedAddressIndex(newAddresses.length - 1);

    // Reset form and show saved addresses
    setAddress({
      name: user?.name || '',
      phone: user?.phone || '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
    });
    setShowAddressForm(false);
  };

  const handleRemoveAddress = (index) => {
    const updated = savedAddresses.filter((_, i) => i !== index);
    setSavedAddresses(updated);
    const storageKey = `fk-saved-addresses-${user?.id || 'guest'}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
    if (selectedAddressIndex >= updated.length) {
      setSelectedAddressIndex(Math.max(0, updated.length - 1));
    }
    if (updated.length === 0) {
      setShowAddressForm(true);
    }
  };

  const handleDeliverHere = () => {
    if (savedAddresses.length === 0) {
      dispatch(addToast({ variant: 'error', message: 'Please add a delivery address first.' }));
      return;
    }
    // Skip order summary step — go directly to payment if only essentials
    setActiveStep(3);
  };

  const handlePlaceOrder = async () => {
    const finalAddress = savedAddresses[selectedAddressIndex];
    if (!finalAddress) {
      dispatch(addToast({ variant: 'error', message: 'Please select a delivery address.' }));
      return;
    }

    try {
      setSubmitting(true);
      const order = await placeOrder({
        address: finalAddress,
        paymentMethod,
      });
      if (order) {
        navigate(`/order-success/${order.id}`);
      } else {
        setSubmitting(false);
      }
    } catch {
      setSubmitting(false);
    }
  };

  const currentAddress = savedAddresses[selectedAddressIndex];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_380px] animate-fade-in-up">
      {/* Steps Column */}
      <div className="space-y-3">
        {/* Step 1: Login (auto-completed) */}
        <div className="checkout-step">
          <div className="checkout-step-header bg-[var(--fk-blue)]">
            <span className="checkout-step-number done">
              <Check className="h-4 w-4" />
            </span>
            <span className="checkout-step-title text-white">LOGIN</span>
            <span className="ml-auto text-sm text-white font-medium">
              {user?.name} — {user?.email}
            </span>
          </div>
        </div>

        {/* Step 2: Delivery Address */}
        <div className="checkout-step">
          <div
            className={`checkout-step-header cursor-pointer ${activeStep === 2 ? 'bg-[var(--fk-blue)]' : 'bg-white'}`}
            onClick={() => setActiveStep(2)}
          >
            <span className={`checkout-step-number ${activeStep === 2 ? 'active' : activeStep > 2 ? 'done' : ''}`}>
              {activeStep > 2 ? <Check className="h-4 w-4" /> : '2'}
            </span>
            <span className={`checkout-step-title ${activeStep === 2 ? 'text-white' : ''}`}>
              DELIVERY ADDRESS
            </span>
            {activeStep > 2 && currentAddress && (
              <span className="ml-auto text-xs text-slate-500 max-w-60 truncate">
                {currentAddress.name}, {currentAddress.line1}, {currentAddress.city}
              </span>
            )}
          </div>
          {activeStep === 2 && (
            <div className="checkout-step-body mt-3">
              {/* Saved addresses */}
              {savedAddresses.length > 0 && !showAddressForm && (
                <div className="space-y-3 mb-4">
                  {savedAddresses.map((addr, i) => (
                    <label
                      key={i}
                      className={`flex items-start gap-3 rounded-[2px] border p-4 cursor-pointer transition ${
                        selectedAddressIndex === i
                          ? 'border-[var(--fk-blue)] bg-blue-50/30'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="saved-address"
                        checked={selectedAddressIndex === i}
                        onChange={() => setSelectedAddressIndex(i)}
                        className="mt-1 accent-[var(--fk-blue)]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{addr.name}</span>
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase">
                            Home
                          </span>
                          <span className="text-xs text-slate-500">{addr.phone}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); handleRemoveAddress(i); }}
                        className="p-1 text-slate-400 hover:text-red-500 transition"
                        title="Remove address"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </label>
                  ))}

                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-2 w-full rounded-[2px] border border-dashed border-slate-300 p-4 text-sm font-medium text-[var(--fk-blue)] transition hover:border-[var(--fk-blue)] hover:bg-blue-50/20"
                  >
                    <Plus className="h-4 w-4" />
                    Add a new address
                  </button>

                  <Button
                    variant="accent"
                    className="mt-2 px-12"
                    onClick={handleDeliverHere}
                  >
                    DELIVER HERE
                  </Button>
                </div>
              )}

              {/* Address Form */}
              {showAddressForm && (
                <>
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="mb-3 text-sm font-medium text-[var(--fk-blue)] hover:underline"
                    >
                      ← Back to saved addresses
                    </button>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ['name', 'Full Name'],
                      ['phone', 'Phone Number'],
                      ['line1', 'Address (House No, Building, Street)'],
                      ['line2', 'Locality / Town (optional)'],
                      ['city', 'City'],
                      ['state', 'State'],
                      ['pincode', 'Pincode (6 digits)'],
                    ].map(([field, label]) => (
                      <label key={field} className={field === 'line1' || field === 'line2' ? 'sm:col-span-2' : ''}>
                        <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
                        <input
                          value={address[field] || ''}
                          onChange={(e) => handleAddressChange(field, e.target.value)}
                          className="w-full rounded-[2px] border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[var(--fk-blue)]"
                        />
                      </label>
                    ))}
                  </div>
                  <Button
                    variant="accent"
                    className="mt-5 px-12"
                    onClick={handleSaveAddress}
                    disabled={!validateAddress()}
                  >
                    SAVE AND DELIVER HERE
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Step 3: Order Summary */}
        <div className="checkout-step">
          <div
            className={`checkout-step-header cursor-pointer ${activeStep === 3 ? 'bg-[var(--fk-blue)]' : 'bg-white'}`}
            onClick={() => activeStep > 2 && setActiveStep(3)}
          >
            <span className={`checkout-step-number ${activeStep === 3 ? 'active' : activeStep > 3 ? 'done' : ''}`}>
              {activeStep > 3 ? <Check className="h-4 w-4" /> : '3'}
            </span>
            <span className={`checkout-step-title ${activeStep === 3 ? 'text-white' : ''}`}>
              ORDER SUMMARY
            </span>
          </div>
          {activeStep === 3 && items.length > 0 && (
            <div className="checkout-step-body mt-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-none">
                  <img
                    src={item.product.images?.[0]?.url}
                    alt={item.product.name}
                    className="h-16 w-16 border border-slate-200 object-contain p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {formatCurrency(Number(item.price || item.product.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
              <Button
                variant="accent"
                className="mt-4 px-12"
                onClick={() => setActiveStep(4)}
              >
                CONTINUE
              </Button>
            </div>
          )}
        </div>

        {/* Step 4: Payment Options */}
        <div className="checkout-step">
          <div
            className={`checkout-step-header cursor-pointer ${activeStep === 4 ? 'bg-[var(--fk-blue)]' : 'bg-white'}`}
            onClick={() => activeStep > 3 && setActiveStep(4)}
          >
            <span className={`checkout-step-number ${activeStep === 4 ? 'active' : ''}`}>4</span>
            <span className={`checkout-step-title ${activeStep === 4 ? 'text-white' : ''}`}>
              PAYMENT OPTIONS
            </span>
          </div>
          {activeStep === 4 && (
            <div className="checkout-step-body mt-3">
              <div className="space-y-0 divide-y divide-slate-100 rounded-[2px] border border-slate-200">
                <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[var(--fk-blue)]"
                  />
                  <Landmark className="h-5 w-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-900">UPI / Net Banking</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[var(--fk-blue)]"
                  />
                  <CreditCard className="h-5 w-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-900">Credit / Debit Card</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[var(--fk-blue)]"
                  />
                  <Banknote className="h-5 w-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-900">Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 rounded-[2px] border border-slate-200 p-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-600">Card Number</label>
                    <input
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="mt-1 w-full rounded-[2px] border border-slate-300 px-3 py-2.5 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Expiry</label>
                    <input
                      placeholder="MM/YY"
                      className="mt-1 w-full rounded-[2px] border border-slate-300 px-3 py-2.5 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">CVV</label>
                    <input
                      type="password"
                      placeholder="***"
                      className="mt-1 w-full rounded-[2px] border border-slate-300 px-3 py-2.5 text-sm outline-none"
                    />
                  </div>
                </div>
              )}

              <Button
                variant="accent"
                className="mt-5 px-12 py-3"
                onClick={handlePlaceOrder}
                disabled={submitting}
              >
                {submitting ? 'PLACING ORDER...' : `CONFIRM ORDER — ${formatCurrency(cart?.summary?.total || 0)}`}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary items={items} summary={cart?.summary} />
      </div>
    </div>
  );
}

export default CheckoutPage;
