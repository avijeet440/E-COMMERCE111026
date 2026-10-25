
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const money = (value) => `৳${Number(value || 0).toLocaleString()}`;

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  // Load category and brand choices for the filter sidebar.
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [categoryResponse, brandResponse] = await Promise.all([
          api.get("/api/categories"),
          api.get("/api/brand"),
        ]);

        const categoryData = categoryResponse.data;
        const brandData = brandResponse.data;

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : categoryData.categories || []
        );

        setBrands(
          Array.isArray(brandData)
            ? brandData
            : brandData.brands || []
        );
      } catch (err) {
        console.error("Could not load filter options:", err);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch products whenever the active filters change.
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          params[key] = value;
        }
      });

      params.limit = 24;

      const response = await api.get("/api/products", { params });

      setProducts(response.data.products || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setProducts([]);
      setTotal(0);
      setError(
        err.response?.data?.message ||
        "Unable to load products. Please check your backend."
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update one filter without replacing the others.
  const updateFilter = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Apply search when the form is submitted.
  const handleSearch = (event) => {
    event.preventDefault();
    updateFilter("search", searchInput.trim());
  };

  // Reset all filters.
  const clearFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    });
  };

  // The backend expects MongoDB IDs for category and brand filters.
  const getOptionId = (option) => option._id || option.id || "";

  return (
    <main className="min-h-screen bg-[#f8f8f5] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
            Explore Bondor
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            All products
          </h1>
          <p className="mt-2 text-neutral-500">
            Find the right product using search and filters.
          </p>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* Left-side filter panel */}
          <aside className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-amber-700 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Search input */}
            <form onSubmit={handleSearch} className="mt-5">
              <label
                htmlFor="product-search"
                className="mb-2 block text-sm font-semibold"
              >
                Search products
              </label>

              <div className="flex overflow-hidden rounded-xl border border-neutral-300 focus-within:border-amber-500">
                <input
                  id="product-search"
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Name or description"
                  className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
                />
                <button
                  type="submit"
                  aria-label="Search products"
                  className="bg-neutral-900 px-4 text-white hover:bg-amber-600"
                >
                  ↗
                </button>
              </div>
            </form>

            {/* Category filter */}
            <div className="mt-6">
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold"
              >
                Category
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(event) =>
                  updateFilter("category", event.target.value)
                }
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 text-sm"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option
                    key={getOptionId(category)}
                    value={getOptionId(category)}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand filter */}
            <div className="mt-5">
              <label
                htmlFor="brand"
                className="mb-2 block text-sm font-semibold"
              >
                Brand
              </label>
              <select
                id="brand"
                value={filters.brand}
                onChange={(event) =>
                  updateFilter("brand", event.target.value)
                }
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 text-sm"
              >
                <option value="">All brands</option>
                {brands.map((brand) => (
                  <option
                    key={getOptionId(brand)}
                    value={getOptionId(brand)}
                  >
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum and maximum price */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold">Price range (৳)</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="min-price"
                    className="mb-1 block text-xs text-neutral-500"
                  >
                    Minimum
                  </label>
                  <input
                    id="min-price"
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={(event) =>
                      updateFilter("minPrice", event.target.value)
                    }
                    placeholder="0"
                    className="w-full rounded-xl border border-neutral-300 px-3 py-3 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="max-price"
                    className="mb-1 block text-xs text-neutral-500"
                  >
                    Maximum
                  </label>
                  <input
                    id="max-price"
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(event) =>
                      updateFilter("maxPrice", event.target.value)
                    }
                    placeholder="Any"
                    className="w-full rounded-xl border border-neutral-300 px-3 py-3 text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchProducts}
              className="mt-6 w-full rounded-xl bg-neutral-900 px-4 py-3 font-semibold text-white transition hover:bg-amber-600"
            >
              Apply filters
            </button>
          </aside>

          {/* Products and sorting */}
          <section className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-neutral-600">
                {loading ? "Loading products..." : `${total} products found`}
              </p>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className="text-sm text-neutral-600"
                >
                  Sort by
                </label>
                <select
                  id="sort"
                  value={filters.sort}
                  onChange={(event) =>
                    updateFilter("sort", event.target.value)
                  }
                  className="rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: low to high</option>
                  <option value="price_desc">Price: high to low</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="rounded-2xl bg-white py-20 text-center text-neutral-500">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
                <h2 className="text-lg font-bold">No products found</h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Try a different search or remove some filters.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 font-semibold text-amber-700 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <article
                    key={product._id}
                    className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Link to={`/products/${product._id}`}>
                      <div className="flex h-52 items-center justify-center bg-neutral-100">
                        <img
                          src={
                            product.images?.[0] ||
                            "https://placehold.co/500x400/f5f5f4/57534e?text=Product"
                          }
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="p-4">
                        <p className="text-xs text-neutral-500">
                          {product.brand?.name || "Bondor collection"}
                        </p>
                        <h2 className="mt-2 line-clamp-2 min-h-12 font-semibold">
                          {product.name}
                        </h2>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span className="text-xl font-bold">
                            {money(product.price)}
                          </span>
                          <span
                            className={`text-xs ${product.stock > 0
                              ? "text-green-700"
                              : "text-red-600"
                              }`}
                          >
                            {product.stock > 0 ? "In stock" : "Sold out"}
                          </span>
                        </div>
                        <span className="mt-4 inline-block text-sm font-semibold text-amber-700">
                          View details →
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}

            {!loading && total > 24 && (
              <p className="mt-6 text-center text-sm text-neutral-500">
                Showing the first 24 products. Pagination can be added next.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Products;
