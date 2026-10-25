
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
} from "lucide-react";
import api from "../api/axios.js";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/api/products/${id}`);
        console.log(response)
        const data = response.data;

        setProduct(data.product || data.data || data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  function addToCart() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingItem = cart.find(
      (item) => item.productId === product._id
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          productId: product._id,
          name: product.name || product.title,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setAdded(true);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="animate-pulse text-gray-500">
          Loading product details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Product unavailable</h1>
        <p className="mt-3 text-gray-500">
          {error || "This product could not be found."}
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-white"
        >
          <ArrowLeft size={17} />
          Back to products
        </Link>
      </div>
    );
  }

  const name = product.name || product.title || "Product";
  const image =
    product.image ||
    product.images?.[0] ||
    product.thumbnail ||
    "";

  const price = Number(product.price || 0);
  const stock = Number(product.stock ?? product.quantity ?? 0);
  const rating = Number(product.rating || 0);
  const description =
    product.description || "No product description available.";

  return (
    <div className="min-h-screen bg-[#f7f8fa] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to products
        </Link>

        <div className="grid gap-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-2 md:p-8 lg:gap-12">
          {/* Product image */}
          <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-4 sm:min-h-[450px]">
            {image ? (
              <img
                src={image}
                alt={name}
                className="max-h-[440px] w-full object-contain"
              />
            ) : (
              <div className="text-sm text-gray-400">
                No product image available
              </div>
            )}
          </div>

          {/* Product information */}
          <div className="flex flex-col py-2">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {product.category?.name ||
                  product.category ||
                  "Featured product"}
              </span>

              <button
                type="button"
                aria-label="Add to wishlist"
                onClick={() => navigate("/bucketlist")}
                className="rounded-full border border-gray-200 p-2.5 text-gray-500 transition hover:border-pink-200 hover:text-pink-600"
              >
                <Heart size={20} />
              </button>
            </div>

            <h1 className="text-2xl font-bold leading-snug tracking-tight text-gray-900 sm:text-3xl">
              {name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1 font-semibold text-amber-500">
                <Star size={17} fill="currentColor" />
                {rating.toFixed(1)}
              </span>

              <span className="text-gray-400">|</span>

              <span className="text-gray-500">
                {product.numReviews ?? product.reviews?.length ?? 0} reviews
              </span>

              <span className="text-gray-400">|</span>

              <span
                className={
                  stock > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {stock > 0 ? `${stock} available` : "Out of stock"}
              </span>
            </div>

            <div className="my-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
              <p className="text-sm text-gray-500">Price</p>
              <p className="mt-1 text-3xl font-extrabold text-gray-900">
                ৳{price.toLocaleString("en-BD")}
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-sm font-bold text-gray-900">
                Product description
              </h2>
              <p className="text-sm leading-7 text-gray-600">
                {description}
              </p>
            </div>

            {/* Quantity selector */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold">Quantity</p>

              <div className="inline-flex items-center rounded-lg border border-gray-200">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="p-3 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>

                <span className="min-w-12 text-center text-sm font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={quantity >= stock}
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(stock, current + 1)
                    )
                  }
                  className="p-3 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={stock <= 0}
                onClick={addToCart}
                className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart size={18} />
                {added ? "Added to cart" : "Add to cart"}
              </button>

              <button
                type="button"
                disabled={stock <= 0}
                onClick={() => {
                  addToCart();
                  navigate("/checkout");
                }}
                className="rounded-full bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Buy now
              </button>
            </div>

            {added && (
              <p className="mt-3 text-sm text-green-600">
                Product added to your local cart.
              </p>
            )}

            {/* Shopping benefits */}
            <div className="mt-7 space-y-4 border-t border-gray-100 pt-5">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck size={19} className="text-blue-600" />
                Delivery information available at checkout
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ShieldCheck size={19} className="text-blue-600" />
                Secure shopping
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw size={19} className="text-blue-600" />
                Check the product return policy before ordering
              </div>
            </div>
          </div>
        </div>

        {/* Description section */}
        <section className="mt-7 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold">Product details</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
            {description}
          </p>
        </section>
      </div>
    </div>
  );
}
