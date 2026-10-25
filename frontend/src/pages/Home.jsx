
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const money = (price) => `৳${Number(price || 0).toLocaleString()}`;

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // NEW: Typing animation
  const words = ["Better", "everyday."];

  const [visibleWords, setVisibleWords] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setVisibleWords([]);

    let index = 0;

    const interval = setInterval(() => {
      index++;
      setVisibleWords(words.slice(0, index));

      if (index >= words.length) {
        clearInterval(interval);

        setTimeout(() => {
          setAnimationKey((key) => key + 1);
        }, 1500);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [animationKey]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/products?limit=8");
        console.log(response);
        console.log(response.data);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Unable to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  return (
    <main className="min-h-screen bg-[#f8f8f5] text-neutral-900">
      {/* Hero section */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:items-center md:py-20">
        <div className="py-6">



          <span className="inline-block rounded-full bg-gradient-to-r from-sky-100 via-blue-100 to-indigo-100 px-3 py-2 text-xl font-semibold text-blue-800">
            Discover something better
          </span>




          <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Great finds.


            <span className="block min-h-[1.2em] text-amber-600">
              {visibleWords.join(" ")}
              <span className="ml-1 inline-block h-8 w-0.5 animate-pulse bg-amber-600 align-middle" />
            </span>


          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-neutral-600 sm:text-lg">
            Explore your favourite products, discover new arrivals,
            and find the right things for your everyday life at Bondor.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
            >
              Shop products →
            </Link>

            <Link
              to="/bucketlist"
              className="rounded-xl border border-neutral-300 px-6 py-3 font-semibold transition hover:bg-white"
            >
              My bucketlist
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-8 text-sm text-neutral-600">
            <div>
              <p className="font-bold text-neutral-900">Easy</p>
              <p>Product discovery</p>
            </div>
            <div>
              <p className="font-bold text-neutral-900">Secure</p>
              <p>Account-based orders</p>
            </div>
            <div>
              <p className="font-bold text-neutral-900">Simple</p>
              <p>Shopping experience</p>
            </div>
          </div>
        </div>

        {/* Hero artwork */}
        <div className="relative overflow-hidden rounded-3xl bg-amber-100 p-5 sm:p-8">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-200" />
          <div className="relative flex min-h-72 items-center justify-center sm:min-h-96">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85"
              alt="Featured red sneaker"
              className="h-64 w-full rounded-2xl object-cover shadow-xl sm:h-96"
            />

            <div className="absolute bottom-4 left-4 rounded-2xl bg-white p-4 shadow-lg sm:bottom-8 sm:left-8">
              <p className="text-xs text-neutral-500">Explore more</p>
              <p className="mt-1 font-bold">Your next favourite find</p>
              <Link
                to="/products"
                className="mt-2 inline-block text-sm font-semibold text-amber-700"
              >
                Browse collection →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits / promotional strip */}
      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6">
          {[
            ["01", "Find your favourites", "Search across the product collection."],
            ["02", "Save for later", "Keep products in your bucketlist."],
            ["03", "Track your orders", "Review your purchases in one place."],
          ].map(([number, title, description]) => (
            <div key={number} className="flex gap-4 p-3">
              <span className="text-sm font-bold text-amber-600">{number}</span>
              <div>
                <h2 className="font-bold">{title}</h2>
                <p className="mt-1 text-sm text-neutral-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
              Handpicked for you
            </p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Featured products
            </h2>
          </div>

          <Link
            to="/products"
            className="font-semibold underline decoration-amber-500 underline-offset-4"
          >
            View all products →
          </Link>
        </div>

        {loading ? (
          <p className="py-12 text-center text-neutral-500">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
            <p className="font-semibold">No products to display yet.</p>
            <p className="mt-2 text-sm text-neutral-500">
              Products will appear here when your backend has product data.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product._id}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link to={`/products/${product._id}`}>
                  <div className="flex h-56 items-center justify-center bg-neutral-100">
                    <img
                      src={
                        product.images?.[0] ||
                        "https://placehold.co/500x400/f5f5f4/57534e?text=Bondor+Product"
                      }
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 min-h-12 font-semibold">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-xl font-bold">
                      {money(product.price)}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {product.stock > 0
                        ? "In stock"
                        : "Out of stock"}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
