import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartSidebar() {
  const { items, isOpen, closeCart, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } =
    useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{ backgroundColor: "var(--theme-colors-overlay)" }}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col shadow-2xl transition-transform duration-300"
        style={{
          backgroundColor: "var(--theme-colors-bg)",
          borderLeft: "1px solid var(--theme-colors-border)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--theme-colors-border)" }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag
              size={20}
              style={{ color: "var(--theme-colors-primary)" }}
            />
            <h2
              className="text-lg font-semibold transition-colors duration-300"
              style={{
                color: "var(--theme-colors-text)",
                fontFamily: "var(--theme-typography-headingFont)",
              }}
            >
              Cart ({totalItems})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-lg transition-colors duration-200"
            style={{ color: "var(--theme-colors-textMuted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--theme-colors-surfaceHover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <ShoppingBag
                size={48}
                style={{ color: "var(--theme-colors-textMuted)" }}
              />
              <p
                className="text-sm transition-colors duration-300"
                style={{ color: "var(--theme-colors-textMuted)" }}
              >
                Your cart is empty
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-lg border transition-colors duration-300"
                  style={{
                    backgroundColor: "var(--theme-colors-surface)",
                    borderColor: "var(--theme-colors-border)",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm font-medium truncate transition-colors duration-300"
                      style={{ color: "var(--theme-colors-text)" }}
                    >
                      {item.name}
                    </h4>
                    <p
                      className="text-xs mt-0.5 transition-colors duration-300"
                      style={{ color: "var(--theme-colors-textMuted)" }}
                    >
                      {item.category}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded transition-colors duration-200"
                          style={{
                            backgroundColor: "var(--theme-colors-bgTertiary)",
                            color: "var(--theme-colors-textSecondary)",
                          }}
                        >
                          <Minus size={12} />
                        </button>
                        <span
                          className="text-sm font-medium w-6 text-center transition-colors duration-300"
                          style={{ color: "var(--theme-colors-text)" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded transition-colors duration-200"
                          style={{
                            backgroundColor: "var(--theme-colors-bgTertiary)",
                            color: "var(--theme-colors-textSecondary)",
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-semibold transition-colors duration-300"
                          style={{ color: "var(--theme-colors-text)" }}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 rounded transition-colors duration-200"
                          style={{ color: "var(--theme-colors-error)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--theme-colors-error)";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "var(--theme-colors-error)";
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-6 py-4 border-t"
            style={{ borderColor: "var(--theme-colors-border)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-sm transition-colors duration-300"
                style={{ color: "var(--theme-colors-textSecondary)" }}
              >
                Subtotal
              </span>
              <span
                className="text-xl font-bold transition-colors duration-300"
                style={{ color: "var(--theme-colors-text)" }}
              >
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                backgroundColor: "var(--theme-colors-primary)",
                color: "var(--theme-colors-bg)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--theme-colors-primaryHover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--theme-colors-primary)";
              }}
            >
              Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2.5 mt-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: "var(--theme-colors-textMuted)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--theme-colors-error)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--theme-colors-textMuted)";
              }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
