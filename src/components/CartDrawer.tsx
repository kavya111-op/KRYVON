import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { CurrencyCode, Product } from '../types';
import { formatPrice } from '../utils/currency';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemove,
  onContinueShopping,
}) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalINR = items.reduce(
    (sum, item) => sum + item.product.priceINR * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close shopping bag"
            className="fixed inset-0 z-[80] bg-slate-950/40 backdrop-blur-[2px] cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your shopping bag"
            className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">KRYVON / YOUR BAG</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Shopping Bag <span className="text-slate-400">({totalQuantity})</span>
                </h2>
              </div>
              <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
                <X size={21} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-cyan-700">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Your bag is waiting</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  Discover products that fit your needs and add your favourites here.
                </p>
                <button
                  onClick={onContinueShopping}
                  className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-700"
                >
                  Explore products <ArrowRight className="ml-2 inline" size={15} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-4 border-b border-slate-100 pb-5">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                        <img src={product.image} alt={product.name} className="h-full w-full object-contain p-2" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-bold text-slate-900">{product.name}</h3>
                        <p className="mt-1 text-sm font-semibold text-cyan-800">
                          {formatPrice(product.priceINR * quantity, currency)}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-slate-200">
                            <button
                              aria-label={`Decrease ${product.name} quantity`}
                              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                              className="p-2 text-slate-600 hover:text-cyan-700"
                            ><Minus size={13} /></button>
                            <span className="min-w-7 text-center text-xs font-bold">{quantity}</span>
                            <button
                              aria-label={`Increase ${product.name} quantity`}
                              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                              className="p-2 text-slate-600 hover:text-cyan-700"
                            ><Plus size={13} /></button>
                          </div>
                          <button
                            onClick={() => onRemove(product.id)}
                            className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-red-600"
                          ><Trash2 size={14} /> Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Subtotal ({totalQuantity} items)</span>
                    <span className="text-xl font-bold text-slate-900">{formatPrice(subtotalINR, currency)}</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Final payment and applicable charges are confirmed at checkout.
                  </p>
                  <button
                    onClick={onContinueShopping}
                    className="mt-5 w-full rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
                  >
                    Continue shopping <ArrowRight className="ml-2 inline" size={16} />
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
