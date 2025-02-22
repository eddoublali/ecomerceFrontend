import { createContext, useEffect, useState } from "react";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    
    const addToCart = (product, selectedSize) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find(
                item => item._id === product._id && item.selectedSize === selectedSize
            );
            
            if (existingProduct) {
                return prevCart.map(item =>
                    item._id === product._id && item.selectedSize === selectedSize 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            } else {
                return [...prevCart, { ...product, selectedSize, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId, selectedSize) => {
        setCart((prevCart) => prevCart.filter(
            item => !(item._id === productId && item.selectedSize === selectedSize)
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const updateCartQuantity = (productId, selectedSize, newQuantity) => {
        setCart((prevCart) => prevCart.map(item =>
            item._id === productId && item.selectedSize === selectedSize 
                ? { ...item, quantity: newQuantity } 
                : item
        ));
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/products", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const res = await response.json();
            console.log(res)
            setProducts(res);
           
        } catch (err) {
            console.error('Fetch products error:', err);
            // Optionally, you could set a state to show an error message to the user
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const currency = '$';
    const deliveryFreeThreshold = 10;

    const value = {
      products,
        currency,
        deliveryFreeThreshold,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartQuantity,
        cart,
        setCart
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;