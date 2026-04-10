# Razorpay Test Mode Implementation Guide

## Overview
This guide provides all the necessary code to implement Razorpay payments in your Flipkart clone. Both the **Backend (Node.js/Express)** and **Frontend (React/Vite)** code are provided below, along with exactly which files and folders you should create or modify.

### Prerequisites
1. **Backend**: Run `npm install razorpay` in the `app/backend` directory.

---

## 1. Backend Implementation

### Target Directory: `app/backend/`

**Step 1: Environment Variables**
Add your Razorpay Test API keys to `app/backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
```

**Step 2: Create Controller (`app/backend/src/controllers/paymentController.js`)**
Create a new file `paymentController.js` inside your `controllers` folder:
```javascript
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount is expected in INR

    const options = {
      amount: amount * 100, // Razorpay expects the amount in paise (1 INR = 100 paise)
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(500).json({ success: false, message: 'Failed to create order' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment completely verified
      // TODO: Update your database using Prisma to mark order as Paid
      return res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
```

**Step 3: Create Route (`app/backend/src/routes/paymentRoutes.js`)**
Create `paymentRoutes.js` inside your `routes` folder:
```javascript
import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);

export default router;
```

**Step 4: Register Route in Server (`app/backend/src/server.js`)**
Inside your `server.js`, import and use the new routes:
```javascript
// ... existing imports
import paymentRoutes from './routes/paymentRoutes.js';

// ... other middlewares (e.g. app.use(express.json());)

// Add the payment routes (Use the port defined in your backend)
app.use('/api/payment', paymentRoutes);

// ... existing code
```

---

## 2. Frontend Implementation

### Target Directory: `app/frontend/`

**Step 1: Create Payment Component (`app/frontend/src/components/Payment/RazorpayButton.jsx`)**
Create a new comprehensive button component. It will dynamically load the Razorpay script so you don't have to alter `index.html`:

```jsx
import React from 'react';
import axios from 'axios';

// Utility to load Razorpay script dynamically
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RazorpayButton = ({ amount, onPaymentSuccess }) => {

  const displayRazorpay = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      // 1. Create order on your backend. Replace PORT 5000 with your exact backend port if different.
      const orderResponse = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount: amount,
      });

      const { order } = orderResponse.data;

      // 2. Setup Razorpay options
      const options = {
        key: 'rzp_test_YOUR_KEY_HERE', // Put your Key ID here. NEVER put Secret Key in frontend.
        amount: order.amount,
        currency: order.currency,
        name: 'Flipkart Clone',
        description: 'Test Transaction',
        image: 'https://your-logo-url.png', // Optional logo
        order_id: order.id, 
        handler: async function (response) {
          // 3. Verify Payment on Backend
          const verifyData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          const verifyResponse = await axios.post('http://localhost:5000/api/payment/verify-payment', verifyData);

          if (verifyResponse.data.success) {
            alert('Payment Successful!');
            if (onPaymentSuccess) onPaymentSuccess();
          } else {
            alert('Payment Verification Failed!');
          }
        },
        prefill: {
          name: 'John Doe',
          email: 'johndoe@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#2874F0', // Flipkart Blue
        },
      };

      // 4. Open Razorpay Checkout
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Error in payment process', error);
      alert('Something went wrong!');
    }
  };

  return (
    <button 
      onClick={displayRazorpay}
      className="bg-[#fb641b] text-white px-6 py-3 font-semibold rounded shadow hover:bg-[#f05a10] transition-colors"
    >
      Pay ₹{amount} with Razorpay
    </button>
  );
};

export default RazorpayButton;
```

**Step 2: Use the Button anywhere in your App (e.g., Checkout Page)**
Wherever you handle your Cart value:
```jsx
// Example inside an existing component (like app/frontend/src/pages/Checkout.jsx)
import React from 'react';
import RazorpayButton from '../components/Payment/RazorpayButton';

const Checkout = () => {
  const totalCartValue = 1500; // Grab this from Redux or React Context

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <p className="mb-4">Total Amount: ₹{totalCartValue}</p>
      
      {/* 
        Drop the button component here. Pass the amount and an optional success callback 
      */}
      <RazorpayButton amount={totalCartValue} onPaymentSuccess={() => console.log('Order complete!')} />
    </div>
  );
};

export default Checkout;
```
