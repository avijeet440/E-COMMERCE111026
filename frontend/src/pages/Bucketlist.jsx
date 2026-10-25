
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const money = (value) => `৳${Number(value || 0).toLocaleString()}`;

function Bucketlist() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [busyId, setBusyId] = useState("");

    // Fetch the current user's saved products.
    const fetchBucketlist = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/api/bucketlist");

            // The backend returns the bucketlist document with populated products.
            const bucketlist = response.data.bucketlist;
            setProducts(bucketlist?.products || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load your bucketlist. Please sign in again if necessary."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBucketlist();
    }, [fetchBucketlist]);

    // Remove a saved product.
    const handleRemove = async (productId) => {
        setBusyId(productId);
        setError("");
        setNotice("");

        try {
            await api.delete(`/api/bucketlist/${productId}`);

            setProducts((current) =>
                current.filter((product) => product._id !== productId)
            );

            setNotice("Product removed from your bucketlist.");
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not remove this product."
            );
        } finally {
            setBusyId("");
        }
    };

    // Add a saved product to the cart.
    const handleAddToCart = async (product) => {
        setBusyId(product._id);
        setError("");
        setNotice("");

        try {
            await api.post("/api/cart", {
                productId: product._id,
                quantity: 1,
            });
            window.dispatchEvent(new Event("cartUpdated"));

            setNotice(`${product.name} added to your cart.`);
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not add this product to your cart."
            );
        } finally {
            setBusyId("");
        }
    };

    return (
        <main className="min-h-screen bg-[#f8f8f5] px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-7xl">
                {/* Heading */}
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                            Saved for later
                        </p>
                        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                            My bucketlist
                        </h1>
                        <p className="mt-2 text-neutral-500">
                            Keep track of products you want to buy.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="rounded-xl bg-neutral-900 px-5 py-3 font-semibold text-white hover:bg-amber-600"
                    >
                        Find more products →
                    </Link>
                </div>

                {/* Feedback */}
                {notice && (
                    <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                        {notice}
                    </div>
                )}

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="rounded-2xl bg-white p-12 text-center text-neutral-500">
                        Loading your bucketlist...
                    </div>
                ) : products.length === 0 ? (
                    <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
                        <div className="text-5xl">♡</div>
                        <h2 className="mt-4 text-xl font-bold">
                            Your bucketlist is empty
                        </h2>
                        <p className="mt-2 text-neutral-500">
                            Browse products and save your favourites here.
                        </p>
                        <Link
                            to="/products"
                            className="mt-6 inline-block rounded-xl bg-amber-500 px-6 py-3 font-semibold text-neutral-900 hover:bg-amber-400"
                        >
                            Explore products
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="mb-5 text-sm text-neutral-500">
                            {products.length} saved {products.length === 1 ? "product" : "products"}
                        </p>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product) => (
                                <article
                                    key={product._id}
                                    className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-lg"
                                >
                                    <Link to={`/products/${product._id}`}>
                                        <div className="flex h-56 items-center justify-center bg-neutral-100">
                                            <img
                                                src={
                                                    product.images?.[0] ||
                                                    "https://placehold.co/500x400/f5f5f4/57534e?text=Product"
                                                }
                                                alt={product.name}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                    </Link>

                                    <div className="p-4">
                                        <Link to={`/products/${product._id}`}>
                                            <h2 className="line-clamp-2 min-h-12 font-semibold hover:text-amber-700">
                                                {product.name}
                                            </h2>
                                        </Link>

                                        <p className="mt-2 text-xl font-bold">
                                            {money(product.price)}
                                        </p>

                                        <p className={`mt-1 text-sm ${product.stock > 0
                                            ? "text-green-700"
                                            : "text-red-600"
                                            }`}>
                                            {product.stock > 0 ? "In stock" : "Out of stock"}
                                        </p>

                                        <button
                                            type="button"
                                            disabled={busyId === product._id || product.stock < 1}
                                            onClick={() => handleAddToCart(product)}
                                            className="mt-4 w-full rounded-xl bg-neutral-900 px-4 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {busyId === product._id
                                                ? "Please wait..."
                                                : "Add to cart"}
                                        </button>

                                        <button
                                            type="button"
                                            disabled={busyId === product._id}
                                            onClick={() => handleRemove(product._id)}
                                            className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 font-semibold text-neutral-700 hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                                        >
                                            Remove from bucketlist
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default Bucketlist;
