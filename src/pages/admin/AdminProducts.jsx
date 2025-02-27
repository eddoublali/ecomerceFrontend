import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { Package, PlusCircle, Edit, Trash2, Search } from "lucide-react";

const AdminProducts = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch products on component mount
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }

    if (user && !user.isAdmin) {
      navigate("/");
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fastshipbackend.onrender.com/api/products");
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }
        
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("https://fastshipbackend.onrender.com/api/categories");
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch categories");
        }
        
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (user?.isAdmin) {
      fetchProducts();
      fetchCategories();
    }
  }, [loading, isAuthenticated, navigate, user]);

  // Filter products based on search term and category
  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products];
      
      if (searchTerm) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (selectedCategory) {
        filtered = filtered.filter(product => 
          product.category._id === selectedCategory
        );
      }
      
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm, selectedCategory]);

  const handleAddProduct = () => {
    navigate("/admin/products/add");
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const token = localStorage.getItem("site");
      
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`https://fastshipbackend.onrender.com/api/products/${selectedProduct._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      // Remove product from state
      setProducts(products.filter(p => p._id !== selectedProduct._id));
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      setDeleteError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setSelectedProduct(null);
    setDeleteError(null);
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Products Management
        </h1>
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
        {/* Filters */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md w-full md:w-1/3"
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md w-full md:w-1/3"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-4">
                  <button
                    onClick={() => handleEditProduct(product._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <strong>{selectedProduct.name}</strong>?
            </p>
            {deleteError && (
              <p className="text-red-500 text-sm mt-2">{deleteError}</p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
