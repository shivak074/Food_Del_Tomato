import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = " http://localhost:8000";
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
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
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
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
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
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        setCartItems(response.data.cartData);
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
            await fetchFoodList();
            if (token) {
                await loadCartData(token);
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

