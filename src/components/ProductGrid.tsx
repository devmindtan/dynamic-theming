import { products, categories } from "../data/products";
import { Product } from "../types/theme";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  searchQuery: string;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function ProductGrid({
  searchQuery,
  selectedCategory,
  onCategoryChange,
}: ProductGridProps) {
  const filtered: Product[] = products.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
            style={{
              backgroundColor:
                selectedCategory === cat
                  ? "var(--theme-colors-primary)"
                  : "var(--theme-colors-surface)",
              color:
                selectedCategory === cat
                  ? "var(--theme-colors-bg)"
                  : "var(--theme-colors-textSecondary)",
              border: `1px solid ${
                selectedCategory === cat
                  ? "var(--theme-colors-primary)"
                  : "var(--theme-colors-border)"
              }`,
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== cat) {
                e.currentTarget.style.backgroundColor = "var(--theme-colors-surfaceHover)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== cat) {
                e.currentTarget.style.backgroundColor = "var(--theme-colors-surface)";
              }
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p
        className="text-sm mb-6 transition-colors duration-300"
        style={{ color: "var(--theme-colors-textMuted)" }}
      >
        {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-20 rounded-xl border"
          style={{
            backgroundColor: "var(--theme-colors-surface)",
            borderColor: "var(--theme-colors-border)",
          }}
        >
          <p
            className="text-lg font-medium transition-colors duration-300"
            style={{ color: "var(--theme-colors-textSecondary)" }}
          >
            No products found
          </p>
          <p
            className="text-sm mt-1 transition-colors duration-300"
            style={{ color: "var(--theme-colors-textMuted)" }}
          >
            Try adjusting your search or category filter
          </p>
        </div>
      )}
    </section>
  );
}
