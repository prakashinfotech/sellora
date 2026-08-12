import { useState } from 'react';
import { X, Zap, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../common/axiosInstance';

interface Props {
  adId: number;
  adTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PLANS = [
  {
    key: '7days',
    label: '7 Days Boost',
    price: 99,
    days: 7,
    icon: <Zap size={20} className="text-sellora-primary" />,
    perks: ['Appear at the top of listings', '3× more visibility', 'Featured badge on your ad'],
  },
  {
    key: '30days',
    label: '30 Days Boost',
    price: 199,
    days: 30,
    icon: <Star size={20} className="text-yellow-500" />,
    perks: ['Appear at the top for a month', '10× more visibility', 'Featured badge on your ad', 'Best value for money'],
    popular: true,
  },
];

declare global {
  interface Window { Razorpay: any; }
}

export default function PromoteModal({ adId, adTitle, onClose, onSuccess }: Props) {
  const [selectedPlan, setSelectedPlan] = useState('30days');
  const [loading, setLoading] = useState(false);

  const loadRazorpay = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePay = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Failed to load payment gateway'); return; }

      const { data } = await api.post('/payments/create-order', { adId, plan: selectedPlan });
      const plan = PLANS.find((p) => p.key === selectedPlan)!;

      const options = {
        key:         data.keyId,
        amount:      data.amount,
        currency:    'INR',
        name:        'Sellora',
        description: `${plan.label} for "${adTitle}"`,
        order_id:    data.orderId,
        theme:       { color: '#4F46E5' },
        handler: async (response: any) => {
          try {
            await api.post('/payments/verify', {
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success(`Ad promoted for ${plan.days} days!`);
            onSuccess();
            onClose();
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      new window.Razorpay(options).open();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not initiate payment');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-sellora-text">Promote Your Ad</h2>
          <button onClick={onClose} className="text-sellora-muted hover:text-sellora-text">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-sellora-muted mb-5 truncate">"{adTitle}"</p>

        {/* Plans */}
        <div className="space-y-3 mb-6">
          {PLANS.map((plan) => (
            <button
              key={plan.key}
              onClick={() => setSelectedPlan(plan.key)}
              className={`w-full text-left border-2 rounded-xl p-4 transition-all relative ${
                selectedPlan === plan.key
                  ? 'border-sellora-primary bg-blue-50'
                  : 'border-sellora-border hover:border-sellora-primary/50'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-4 bg-sellora-warm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  POPULAR
                </span>
              )}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {plan.icon}
                  <span className="font-bold text-sellora-text">{plan.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-sellora-primary">₹{plan.price}</span>
                </div>
              </div>
              <ul className="space-y-1">
                {plan.perks.map((p) => (
                  <li key={p} className="text-xs text-sellora-muted flex items-center gap-1.5">
                    <span className="text-green-500 font-bold">✓</span> {p}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Pay button */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full btn-gradient font-semibold py-3 rounded-lg disabled:opacity-60 text-sm"
        >
          {loading
            ? 'Opening payment...'
            : `Pay ₹${PLANS.find((p) => p.key === selectedPlan)?.price} with Razorpay`}
        </button>
        <p className="text-center text-xs text-sellora-muted mt-3">
          Secured by Razorpay · UPI / Cards / Netbanking accepted
        </p>
      </div>
    </div>
  );
}
