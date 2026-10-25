
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function Cart() {
    const {
        items,
        loading,
        error,
        updateItem,
        removeItem: removeCartItem,
        clearCart,
    } = useCart();
    const [actionError, setActionError] = useState("");

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;

        try {
            setActionError("");
            await updateItem(productId, quantity);
        } catch (err) {
            setActionError(
                err.response?.data?.message ||
                "Unable to update the quantity."
            );
        }
    };

    const removeItem = async (productId) => {
        try {
            setActionError("");
            await removeCartItem(productId);
        } catch (err) {
            setActionError(
                err.response?.data?.message ||
                "Unable to remove this product."
            );
        }
    };

    const total = items.reduce((sum, item) => {
        const product = item.product || item;
        return sum +
            Number(product.price || 0) * Number(item.quantity || 1);
    }, 0);

    if (loading) {
        return <p className="p-8 text-center">Loading your cart...</p>;
    }

    return (
        <main className="mx-auto max-w-5xl px-4 py-10">
            <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

            {(actionError || error) && (
                <p className="mb-5 rounded-lg bg-red-100 p-3 text-red-700">
                    {actionError || error}
                </p>
            )}

            {items.length === 0 ? (
                <div className="rounded-xl border p-8 text-center">
                    <p className="mb-4 text-gray-600">
                        Your cart is empty.
                    </p>
                    <Link
                        to="/products"
                        className="inline-block rounded-lg bg-black px-5 py-3 font-semibold text-white"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                    <section className="space-y-4">
                        {items.map((item) => {
                            const product = item.product || item;
                            const productId =
                                product._id || item.productId;
                            const quantity = Number(item.quantity || 1);

                            return (
                                <article
                                    key={productId}
                                    className="flex flex-wrap items-center gap-4 rounded-xl border p-4"
                                >
                                    {product.images?.[0] && (
                                        <img
                                            src={
                                                typeof product.images[0] === "string"
                                                    ? product.images[0]
                                                    : product.images[0].url
                                            }
                                            alt={product.name || "Product"}
                                            className="h-24 w-24 rounded-lg object-cover"
                                        />
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <h2 className="font-semibold">
                                            {product.name || "Product"}
                                        </h2>
                                        <p className="mt-1 text-gray-600">
                                            ৳{Number(product.price || 0).toFixed(2)}
                                        </p>

                                        <div className="mt-3 flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(
                                                        productId,
                                                        quantity - 1
                                                    )
                                                }
                                                disabled={quantity <= 1}
                                                className="rounded border px-3 py-1 disabled:opacity-40"
                                                aria-label="Decrease quantity"
                                            >
                                                −
                                            </button>

                                            <span>{quantity}</span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(
                                                        productId,
                                                        quantity + 1
                                                    )
                                                }
                                                className="rounded border px-3 py-1"
                                                aria-label="Increase quantity"
                                                disabled={quantity >= Number(product.stock ?? Infinity)}
                                                title={
                                                    quantity >= Number(product.stock ?? Infinity)
                                                        ? "No more stock available"
                                                        : undefined
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeItem(productId)}
                                        className="text-sm font-medium text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </article>
                            );
                        })}
                    </section>

                    <aside className="h-fit rounded-xl border p-5">
                        <h2 className="mb-4 text-xl font-bold">
                            Order Summary
                        </h2>

                        <div className="flex justify-between gap-4">
                            <span>Subtotal</span>
                            <span className="font-semibold">
                                ৳{total.toFixed(2)}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                            Shipping and final totals are calculated at checkout.
                        </p>

                        <Link
                            to="/checkout"
                            className="mt-6 block rounded-lg bg-black px-4 py-3 text-center font-semibold text-white hover:bg-gray-800"
                        >
                            Proceed to Checkout
                        </Link>

                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    setActionError("");
                                    await clearCart();
                                } catch (err) {
                                    setActionError(
                                        err.response?.data?.message ||
                                        "Unable to clear your cart."
                                    );
                                }
                            }}
                            className="mt-3 w-full rounded-lg border px-4 py-3 hover:bg-gray-50"
                        >
                            Clear Cart
                        </button>
                    </aside>
                </div>
            )}
        </main>
    );
}

export default Cart;
