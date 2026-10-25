
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext.jsx";

const Checkout = () => {
    const navigate = useNavigate();
    const { items: cartItems, loading, error: cartError } = useCart();
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [shippingAddress, setShippingAddress] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("cod");

    // Calculate the subtotal from the loaded cart items
    const totalPrice = cartItems.reduce((total, item) => {
        const product = item.product || item;
        const price = Number(product.price || item.price || 0);
        const quantity = Number(item.quantity || 1);

        return total + price * quantity;
    }, 0);

    // Update one shipping-address field
    const handleAddressChange = (event) => {
        const { name, value } = event.target;

        setShippingAddress((previousAddress) => ({
            ...previousAddress,
            [name]: value,
        }));
    };

    // Send the order to the backend
    const handlePlaceOrder = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        try {
            setPlacingOrder(true);

            const response = await api.post("/api/orders", {
                shippingAddress,
                paymentMethod,
            });

            setSuccess(response.data.message || "Order placed successfully.");

            // Backend returns the created order
            const orderId = response.data.order?._id;

            if (orderId) {
                window.dispatchEvent(new Event("cartUpdated"));
                navigate(`/orders/${orderId}`, {
                    state: { orderPlaced: true },
                });
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to place your order. Please try again."
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-neutral-600">Loading checkout...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                        BONDOR
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">
                        Checkout
                    </h1>
                    <p className="mt-2 text-neutral-500">
                        Enter your delivery details to place your order.
                    </p>
                </div>

                {(error || cartError) && (
                    <div
                        role="alert"
                        className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {error || cartError}
                    </div>
                )}

                {success && (
                    <div
                        role="status"
                        className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
                    >
                        {success}
                    </div>
                )}

                {cartItems.length === 0 ? (
                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-neutral-900">
                            Your cart is empty
                        </h2>
                        <p className="mt-2 text-neutral-500">
                            Add some products before proceeding to checkout.
                        </p>
                        <Link
                            to="/products"
                            className="mt-6 inline-flex rounded-lg bg-neutral-900 px-5 py-3 font-semibold text-white transition hover:bg-neutral-700"
                        >
                            Browse products
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
                        {/* Shipping and payment form */}
                        <form
                            onSubmit={handlePlaceOrder}
                            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8"
                        >
                            <h2 className="text-xl font-semibold text-neutral-900">
                                Shipping information
                            </h2>

                            <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium text-neutral-700"
                                    >
                                        Full name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        value={shippingAddress.name}
                                        onChange={handleAddressChange}
                                        required
                                        className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="mb-2 block text-sm font-medium text-neutral-700"
                                    >
                                        Phone number
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        value={shippingAddress.phone}
                                        onChange={handleAddressChange}
                                        required
                                        className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="city"
                                        className="mb-2 block text-sm font-medium text-neutral-700"
                                    >
                                        City
                                    </label>
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        autoComplete="address-level2"
                                        value={shippingAddress.city}
                                        onChange={handleAddressChange}
                                        required
                                        className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                                        placeholder="Enter your city"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="address"
                                        className="mb-2 block text-sm font-medium text-neutral-700"
                                    >
                                        Street address
                                    </label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        autoComplete="street-address"
                                        value={shippingAddress.address}
                                        onChange={handleAddressChange}
                                        required
                                        rows={3}
                                        className="w-full resize-y rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                                        placeholder="House, road, area, or street address"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="postalCode"
                                        className="mb-2 block text-sm font-medium text-neutral-700"
                                    >
                                        Postal code
                                    </label>
                                    <input
                                        id="postalCode"
                                        name="postalCode"
                                        type="text"
                                        autoComplete="postal-code"
                                        value={shippingAddress.postalCode}
                                        onChange={handleAddressChange}
                                        required
                                        className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                                        placeholder="Enter postal code"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 border-t border-neutral-200 pt-6">
                                <h2 className="text-xl font-semibold text-neutral-900">
                                    Payment method
                                </h2>

                                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-300 p-4">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === "cod"}
                                        onChange={(event) =>
                                            setPaymentMethod(event.target.value)
                                        }
                                        className="mt-1 accent-amber-700"
                                    />
                                    <span>
                                        <span className="block font-medium text-neutral-900">
                                            Cash on delivery
                                        </span>
                                        <span className="mt-1 block text-sm text-neutral-500">
                                            Pay when your order arrives.
                                        </span>
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={placingOrder || cartItems.length === 0}
                                    className="mt-6 w-full rounded-lg bg-neutral-900 px-5 py-3.5 font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {placingOrder ? "Placing order..." : "Place order"}
                                </button>

                                <Link
                                    to="/cart"
                                    className="mt-4 block text-center text-sm font-medium text-neutral-600 hover:text-neutral-900"
                                >
                                    Back to cart
                                </Link>
                            </div>
                        </form>

                        {/* Order summary */}
                        <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="text-xl font-semibold text-neutral-900">
                                Order summary
                            </h2>

                            <div className="mt-6 space-y-5">
                                {cartItems.map((item, index) => {
                                    const product = item.product || item;
                                    const price = Number(product.price || item.price || 0);
                                    const quantity = Number(item.quantity || 1);
                                    const key =
                                        item._id || product._id || `${product.name}-${index}`;

                                    return (
                                        <div key={key} className="flex gap-4">
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                                                {product.images?.[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name || "Product"}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                                                        No image
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="line-clamp-2 font-medium text-neutral-900">
                                                    {product.name || "Product"}
                                                </p>
                                                <p className="mt-1 text-sm text-neutral-500">
                                                    Qty: {quantity}
                                                </p>
                                            </div>

                                            <p className="shrink-0 text-sm font-semibold text-neutral-900">
                                                ৳{(price * quantity).toLocaleString("en-BD")}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 space-y-3 border-t border-neutral-200 pt-5">
                                <div className="flex justify-between text-sm text-neutral-600">
                                    <span>Subtotal</span>
                                    <span>৳{totalPrice.toLocaleString("en-BD")}</span>
                                </div>

                                <div className="flex justify-between text-sm text-neutral-600">
                                    <span>Shipping</span>
                                    <span>Calculated separately, if applicable</span>
                                </div>

                                <div className="flex justify-between border-t border-neutral-200 pt-4 text-lg font-bold text-neutral-900">
                                    <span>Estimated total</span>
                                    <span>৳{totalPrice.toLocaleString("en-BD")}</span>
                                </div>

                                <p className="pt-2 text-xs leading-5 text-neutral-500">
                                    The backend calculates the actual order total from the
                                    products in your cart. The displayed total is an estimate.
                                </p>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Checkout;
