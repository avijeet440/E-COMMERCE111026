
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const money = (value) => `৳${Number(value || 0).toLocaleString()}`;

const statusStyles = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-indigo-100 text-indigo-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get("/api/orders/my-orders");
                setOrders(response.data.orders || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load your orders. Please sign in again if necessary."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <main className="min-h-screen bg-[#f8f8f5] px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-5xl">
                {/* Heading */}
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                            Your account
                        </p>
                        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                            My orders
                        </h1>
                        <p className="mt-2 text-neutral-500">
                            Review your purchases and order status.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="rounded-xl bg-neutral-900 px-5 py-3 font-semibold text-white hover:bg-amber-600"
                    >
                        Continue shopping
                    </Link>
                </div>

                {/* Loading and error states */}
                {loading ? (
                    <div className="rounded-2xl bg-white p-12 text-center text-neutral-500">
                        Loading your orders...
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                        {error}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
                        <div className="text-5xl">📦</div>
                        <h2 className="mt-4 text-xl font-bold">No orders yet</h2>
                        <p className="mt-2 text-neutral-500">
                            Your purchases will appear here after you place an order.
                        </p>
                        <Link
                            to="/products"
                            className="mt-6 inline-block rounded-xl bg-amber-500 px-6 py-3 font-semibold text-neutral-900 hover:bg-amber-400"
                        >
                            Explore products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                                <p className="text-sm text-neutral-500">Total orders</p>
                                <p className="mt-2 text-3xl font-bold">{orders.length}</p>
                            </div>

                            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                                <p className="text-sm text-neutral-500">Delivered</p>
                                <p className="mt-2 text-3xl font-bold">
                                    {orders.filter((order) => order.orderStatus === "delivered").length}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                                <p className="text-sm text-neutral-500">Pending</p>
                                <p className="mt-2 text-3xl font-bold">
                                    {orders.filter((order) =>
                                        ["pending", "confirmed", "processing", "shipped"].includes(
                                            order.orderStatus
                                        )
                                    ).length}
                                </p>
                            </div>
                        </div>

                        {orders.map((order) => (
                            <article
                                key={order._id}
                                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                            >
                                {/* Order header */}
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-50 px-5 py-4">
                                    <div>
                                        <p className="text-xs text-neutral-500">Order ID</p>
                                        <p className="mt-1 break-all font-semibold">
                                            #{order._id}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-neutral-500">Order date</p>
                                        <p className="mt-1 font-medium">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyles[order.orderStatus] ||
                                            "bg-neutral-100 text-neutral-700"
                                            }`}
                                    >
                                        {order.orderStatus || "pending"}
                                    </span>
                                </div>

                                {/* Ordered products */}
                                <div className="space-y-4 p-5">
                                    {(order.items || []).map((item, index) => (
                                        <div
                                            key={`${order._id}-${index}`}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                                                {item.product?.images?.[0] ? (
                                                    <img
                                                        src={item.product.images[0]}
                                                        alt={item.name}
                                                        className="h-full w-full rounded-xl object-contain"
                                                    />
                                                ) : (
                                                    <span className="text-2xl">🛍️</span>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold">
                                                    {item.name || item.product?.name || "Product"}
                                                </p>
                                                <p className="mt-1 text-sm text-neutral-500">
                                                    Quantity: {item.quantity}
                                                </p>
                                            </div>

                                            <p className="shrink-0 font-semibold">
                                                {money(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Order footer */}
                                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 px-5 py-4">
                                    <div>
                                        <p className="text-sm text-neutral-500">Payment</p>
                                        <p className="mt-1 font-medium uppercase">
                                            {(order.paymentMethod || "cod").replace("_", " ")}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-neutral-500">Order total</p>
                                        <p className="mt-1 text-xl font-bold">
                                            {money(order.totalPrice)}
                                        </p>
                                    </div>

                                    <Link
                                        to={`/orders/${order._id}`}
                                        className="rounded-xl border border-neutral-300 px-4 py-2.5 font-semibold hover:bg-neutral-50"
                                    >
                                        View details →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Orders;
