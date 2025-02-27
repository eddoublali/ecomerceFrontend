import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Product = () => {
  const { products, addToCart } = useContext(ShopContext);
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  
  const product = products.find(item => item._id.toString() === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Added to cart!
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="aspect-square rounded-lg overflow-hidden">
            <img 
              src={product.image[0] ? `https://fastshipbackend.onrender.com${product.image[0]}` : ''}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{product.category.name} / {product.subCategory}</p>
            </div>

            <p className="text-2xl font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-gray-600">{product.description}</p>
            
            {/* Size Selection */}
            <div className="space-y-2">
              <p className="font-medium text-gray-900">Select Size</p>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center rounded-md border 
                      ${selectedSize === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Bestseller Badge */}
            {product.bestseller && (
              <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                Bestseller
              </div>
            )}
            
            {/* Add to Cart Button */}
            <button 
              className={`w-full md:w-auto px-6 py-3 rounded-lg transition-colors
                ${selectedSize 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              disabled={!selectedSize}
              onClick={handleAddToCart}
            >
              {selectedSize ? 'Add to Cart' : 'Select a Size'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
