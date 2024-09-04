import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = "https://food-delivery-backend-7sb4.onrender.com";
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || "");
    const [food_list, setFoodList] = useState([]);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            try {
                await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
            } catch (error) {
                console.error("Error adding item to cart:", error);
                // Handle the error (e.g., show a message to the user)
            }
        }
    };

    const removeFromCart = async (itemId) => {
        if (cartItems[itemId] > 1) {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        } else {
            const { [itemId]: _, ...rest } = cartItems;
            setCartItems(rest);
        }
        if (token) {
            try {
                await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
            } catch (error) {
                console.error("Error removing item from cart:", error);
                // Handle the error (e.g., show a message to the user)
            }
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        if (food_list.length === 0) return totalAmount;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");

            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error("Error loading cart data:", error);
            // Handle the error (e.g., clear cart data, show a message to the user)
        }
    };

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post(url + "/api/user/refresh-token", { refreshToken });
            const newToken = response.data.token;
            setToken(newToken);
            localStorage.setItem("accessToken", newToken);
        } catch (error) {
            console.error("Error refreshing token:", error);
            // Handle token refresh failure (e.g., logout the user)
        }
    };

    useEffect(() => {
        async function loadData() {
            try {
                await fetchFoodList();
                if (token) {
                    await loadCartData(token);
                }
            } catch (error) {
                console.error("Error loading data:", error);
                // Handle the error (e.g., show a message to the user)
            }
        }
        loadData();
    }, [token]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (refreshToken) {
                refreshAccessToken();
            }
        }, 15 * 60 * 1000); // Refresh every 15 minutes
        return () => clearInterval(interval);
    }, [refreshToken]);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        setRefreshToken, // Ensure this is available in the context
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
