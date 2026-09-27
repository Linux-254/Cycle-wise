import React from 'react';
import { ShoppingBag, X, Trash2, ArrowRight, Sparkles, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

export interface CartItem {
  id: string;
  shopName: string;
  location: string;
  type: 'offer' | 'need';
  title: string;
  estimatedValue: number;
}

interface BarterCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckoutCart: () => void;
}

export const BarterCartModal: React.FC<BarterCartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
  onCheckoutCart,
}) => {
  if (!isOpen) return null;

  const requestedItems = cartItems.filter((i) => i.type === 'offer'); // items offered by other shops that you want
  const offeredItems = cartItems.filter((i) => i.type === 'need'); // needs of other shops you can supply

  const totalRequestedValue = requestedItems.reduce((acc, item) => acc + item.estimatedValue, 0);
  const totalOfferedValue = offeredItems.reduce((acc, item) => acc + item.estimatedValue, 0);

  const valueDelta = Math.abs(totalRequestedValue - totalOfferedValue);
  const isParityBalanced = valueDelta <= 3000 || cartItems.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF9F5] border border-[#E3E0D7] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#121B2B] text-white flex items-center justify-between border-b border-[#202E44]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E7B84B] to-[#C9972E] p-0.5 shadow-md flex items-center justify-center text-[#121B2B]">
              <ShoppingBag className="w-5 h-5 text-[#121B2B]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Barter Trade Cart & Basket</h3>
              <p className="text-xs text-[#8E9CAE]">Combine multiple surplus items & needs into a single trade loop</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E9CAE] hover:text-white hover:bg-[#1E2D44] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Value Balance Indicator */}
        <div className="bg-white border-b border-[#E3E0D7] p-3.5 sm:p-4 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold text-[#18243A]">
            <span>Barter Value Parity Meter</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${isParityBalanced ? 'bg-[#EAF5F0] text-[#2E8B68]' : 'bg-[#FFF7ED] text-[#D8783D]'}`}>
              {isParityBalanced ? '✓ Fair Value Balanced' : 'Value Delta: ~KES ' + valueDelta.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-[#EAF5F0] border border-[#2E8B68]/30">
              <span className="text-[#2E8B68] font-bold block">Items You Request ({requestedItems.length}):</span>
              <strong className="text-sm font-bold text-[#18243A]">KES {totalRequestedValue.toLocaleString()}</strong>
            </div>

            <div className="p-2 rounded-lg bg-[#FEFCE8] border border-[#E7B84B]/40">
              <span className="text-[#B48013] font-bold block">Items You Supply ({offeredItems.length}):</span>
              <strong className="text-sm font-bold text-[#18243A]">KES {totalOfferedValue.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <ShoppingBag className="w-10 h-10 text-[#8E9CAE] mx-auto opacity-50" />
              <p className="font-bold text-sm text-[#18243A]">Your Barter Cart is Empty</p>
              <p className="text-xs text-[#68727D] max-w-sm mx-auto">
                Explore the network or create a trade request, then add businesses here while you compare a multi-item exchange.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white rounded-xl border border-[#E3E0D7] flex items-center justify-between text-xs gap-3 shadow-2xs"
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#18243A] truncate">{item.title}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        item.type === 'offer'
                          ? 'bg-[#EAF5F0] text-[#2E8B68]'
                          : 'bg-[#FEFCE8] text-[#B48013]'
                      }`}
                    >
                      {item.type === 'offer' ? 'Requested Item' : 'Your Supply'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#68727D] text-[11px]">
                    <Building className="w-3 h-3 text-[#E7B84B]" />
                    <span>{item.shopName} ({item.location})</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="font-bold text-sm text-[#18243A]">
                    KES {item.estimatedValue.toLocaleString()}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 rounded-lg text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-[#EFECE4] border-t border-[#E3E0D7] flex items-center justify-between gap-2">
            <button
              onClick={onClearCart}
              className="text-xs font-semibold text-[#DC2626] hover:underline"
            >
              Clear Basket
            </button>

            <button
              onClick={() => {
                onCheckoutCart();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#121B2B] text-[#E7B84B] font-bold text-xs flex items-center space-x-2 transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-[#E7B84B]" />
              <span>Checkout Multi-Item Trade Loop</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
