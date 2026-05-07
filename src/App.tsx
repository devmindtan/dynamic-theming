import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import ProductGrid from "./components/ProductGrid";
import CartSidebar from "./components/CartSidebar";
import ThemeEditor from "./components/ThemeEditor";
import Footer from "./components/Footer";

function AppContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{ backgroundColor: "var(--theme-colors-bg)" }}
    >
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenThemeEditor={() => setThemeEditorOpen(true)}
      />
      <HeroBanner />
      <main className="flex-1">
        <ProductGrid
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </main>
      <Footer />
      <CartSidebar />
      <ThemeEditor isOpen={themeEditorOpen} onClose={() => setThemeEditorOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ThemeProvider>
  );
}
