import { Star, ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import { Product } from "../types/theme";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: "var(--theme-colors-surface)",
        borderColor: "var(--theme-colors-border)",
        boxShadow: "0 1px 3px var(--theme-colors-shadow)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 30px var(--theme-colors-shadow)";
        e.currentTarget.style.borderColor = "var(--theme-colors-borderLight)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px var(--theme-colors-shadow)";
        e.currentTarget.style.borderColor = "var(--theme-colors-border)";
      }}
    >
      {/* Image */}
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{ backgroundColor: "var(--theme-colors-bgTertiary)" }}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse" style={{ backgroundColor: "var(--theme-colors-bgTertiary)" }} />
        )}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className="px-2.5 py-1 text-xs font-semibold rounded-md"
              style={{
                backgroundColor: "var(--theme-colors-primary)",
                color: "var(--theme-colors-bg)",
              }}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span
              className="px-2.5 py-1 text-xs font-semibold rounded-md"
              style={{
                backgroundColor: "var(--theme-colors-error)",
                color: "#ffffff",
              }}
            >
              -{discount}%
            </span>
          )}
        </div>

        {/* Like button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 p-2 rounded-full transition-all duration-200 hover:scale-110"
          style={{
            backgroundColor: liked ? "var(--theme-colors-error)" : "var(--theme-colors-overlay)",
            color: liked ? "#ffffff" : "var(--theme-colors-text)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p
          className="text-xs font-medium uppercase tracking-wider mb-1.5 transition-colors duration-300"
          style={{ color: "var(--theme-colors-primary)" }}
        >
          {product.category}
        </p>
        <h3
          className="font-semibold text-sm leading-tight mb-2 line-clamp-2 transition-colors duration-300"
          style={{
            color: "var(--theme-colors-text)",
            fontFamily: "var(--theme-typography-headingFont)",
          }}
        >
          {product.name}
        </h3>
        <p
          className="text-xs mb-3 line-clamp-2 transition-colors duration-300"
          style={{ color: "var(--theme-colors-textMuted)" }}
        >
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product.rating) ? "var(--theme-colors-accent)" : "none"}
                style={{ color: "var(--theme-colors-accent)" }}
              />
            ))}
          </div>
          <span
            className="text-xs transition-colors duration-300"
            style={{ color: "var(--theme-colors-textMuted)" }}
          >
            ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span
              className="text-lg font-bold transition-colors duration-300"
              style={{ color: "var(--theme-colors-text)" }}
            >
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span
                className="text-sm line-through transition-colors duration-300"
                style={{ color: "var(--theme-colors-textMuted)" }}
              >
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="p-2.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
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
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
