import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { ArrowLeft, Upload, Save } from "lucide-react";

const AddProduct = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: [],
    category: "",
    subCategory: "",
    sizes: [],
    bestseller: false
  });

  // Fetch categories on component mount
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }

    if (user && !user.isAdmin) {
      navigate("/");
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/categories");
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch categories");
        }
        
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, [loading, isAuthenticated, navigate, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name === "sizes") {
      // Handle sizes as an array
      const sizesArray = value.split(",").map(size => size.trim());
      setFormData({ ...formData, sizes: sizesArray });
    } else if (name === "price") {
      // Ensure price is a number
      setFormData({ ...formData, [name]: value === "" ? "" : Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (e) => {
    // This is a simplified version - in a real app, you'd use a file upload service
    // For now, we'll just store the file names
    const fileNames = Array.from(e.target.files).map(file => file.name);
    setFormData({ ...formData, image: [...formData.image, ...fileNames] });
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.image];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, image: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.name || !formData.description || !formData.price || 
          !formData.category || !formData.subCategory || formData.image.length === 0 || 
          formData.sizes.length === 0) {
        throw new Error("Please fill in all required fields");
      }

      const token = localStorage.getItem("site");
      
      if (!token) {
        throw new Error("Authentication required");
      }

      // Add current date
      const productData = {
        ...formData,
        date: new Date().toISOString()
      };

      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create product");
      }

      // Navigate to products page on success
      navigate("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate("/admin/products")}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Add New Product</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub Category *
            </label>
            <input
              type="text"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sizes (comma separated) *
            </label>
            <input
              type="text"
              name="sizes"
              value={formData.sizes.join(", ")}
              onChange={handleChange}
              placeholder="S, M, L, XL"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="bestseller"
              checked={formData.bestseller}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Mark as Bestseller
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images *
          </label>
          <div className="flex items-center space-x-2 mb-4">
            <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
            </label>
            <span className="text-sm text-gray-500">
              {formData.image.length} {formData.image.length === 1 ? 'image' : 'images'} selected
            </span>
          </div>
          
          {formData.image.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.image.map((img, index) => (
                <div key={index} className="relative bg-gray-100 p-2 rounded-md">
                  <span className="text-sm">{img}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;