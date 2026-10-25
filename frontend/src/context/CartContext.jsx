import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import api from "../api/axios.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [] });
    const [cartOwnerId, setCartOwnerId] = useState(null);
    const [loadedOwnerId, setLoadedOwnerId] = useState(null);
    const [error, setError] = useState("");
    const userId = user?.id || user?._id;

    const refreshCart = useCallback(async () => {
        try {
            const response = await api.get("/api/cart");
            const updatedCart = response.data.cart;

            setCart(updatedCart);
            setCartOwnerId(userId);
            setError("");
            return updatedCart;
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to load your cart. Please try again."
            );
            throw requestError;
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        let active = true;

        // The API request updates cart state asynchronously after it resolves.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        refreshCart()
            .catch((requestError) =>
                console.error("Unable to load cart:", requestError)
            )
            .finally(() => {
                if (active) {
                    setLoadedOwnerId(userId);
                }
            });

        const handleCartUpdated = () => {
            refreshCart().catch((requestError) =>
                console.error("Unable to refresh cart:", requestError)
            );
        };

        window.addEventListener("cartUpdated", handleCartUpdated);
        return () => {
            active = false;
            window.removeEventListener("cartUpdated", handleCartUpdated);
        };
    }, [refreshCart, userId]);

    const addItem = async (productId, quantity = 1) => {
        try {
            const response = await api.post("/api/cart", { productId, quantity });
            setCart(response.data.cart);
            setCartOwnerId(userId);
            setError("");
            return response.data.cart;
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to add this product to your cart."
            );
            throw requestError;
        }
    };

    const updateItem = async (productId, quantity) => {
        try {
            const response = await api.put(`/api/cart/${productId}`, { quantity });
            setCart(response.data.cart);
            setCartOwnerId(userId);
            setError("");
            return response.data.cart;
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to update your cart."
            );
            throw requestError;
        }
    };

    const removeItem = async (productId) => {
        try {
            const response = await api.delete(`/api/cart/${productId}`);
            setCart(response.data.cart);
            setCartOwnerId(userId);
            setError("");
            return response.data.cart;
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to remove this product from your cart."
            );
            throw requestError;
        }
    };

    const clearCart = async () => {
        try {
            const response = await api.delete("/api/cart");
            setCart(response.data.cart);
            setCartOwnerId(userId);
            setError("");
            return response.data.cart;
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to clear your cart."
            );
            throw requestError;
        }
    };

    const items = userId && cartOwnerId === userId ? cart.items || [] : [];
    const itemCount = items.reduce(
        (count, item) => count + Number(item.quantity || 0),
        0
    );
    const loading = Boolean(userId) && loadedOwnerId !== userId;

    return (
        <CartContext.Provider
            value={{
                cart,
                items,
                itemCount,
                loading,
                error: userId ? error : "",
                refreshCart,
                addItem,
                updateItem,
                removeItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
}