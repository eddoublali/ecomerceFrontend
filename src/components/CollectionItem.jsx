import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Productitem from "./Productitem";
import { assets } from "../assets/assets";

export default function CollectionItem() {
  const[searchTerm,setSearchTerm]=useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [sortBy, setSortBy] = useState('relevant');

  const { products } = useContext(ShopContext);

const filterItem=products.filter((item)=>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())&&
  (selectedCategories.length === 0 || selectedCategories.includes(item.category.name))&&
  (selectedType.length === 0 || selectedType.includes(item.subCategory))
).sort((a, b) => {
  switch (sortBy) {
    case 'low-to-high':
      return a.price - b.price;
    case 'high-to-low':
      return b.price - a.price;
    default:
      return 0;
  }})
const handleCheckboxChange = (event) => {
  const category = event.target.value;
  setSelectedCategories((prev) =>
    prev.includes(category)
      ? prev.filter((c) => c !== category)
      : [...prev, category]
  );
  
}
const handleCheckboxChangetype = (event) => {
  const type = event.target.value;
  setSelectedType((prev) =>
    prev.includes(type)
      ? prev.filter((c) => c !== type)
      : [...prev, type]
  );
  
}

  return (
    <div className="px-10 flex gap-10 flex-col md:flex-row">
      {/* Filter Section */}
      <div className="md:w-1/5 w-full mt-5">
        {/* Filter Toggle for Small & Medium Screens */}
        <div
          className="cursor-pointer flex items-center gap-2 md:hidden "
          onClick={() => setFilterVisible(!filterVisible)}
        >
          <p className="items-center text-xs text-gray-800 md:text-base">FILTERS</p>
          <img
            src={assets.dropdown_icon}
            alt=""
            className={`w-3 transition-transform duration-300 ${filterVisible ? "rotate-90" : ""}`}
          />
        </div>

        {/* Filters (conditionally rendered on small & medium screens) */}
        <div className={`${filterVisible ? "block" : "hidden"} md:block border p-8 flex flex-col gap-2`}>
          <p className="pb-3">CATEGORIES</p>
          {["Men", "Women", "Kids"].map((category) => (
            <div key={category} className="flex gap-5">
              <input type="checkbox" className="accent-gray-700" value={category} checked={selectedCategories.includes(category)} onChange={handleCheckboxChange}/>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">{category}</p>
            </div>
          ))}
        </div>

        <div className={`${filterVisible ? "block" : "hidden"} md:block border p-8 flex flex-col gap-2`}>
          <p className="pb-3">TYPE</p>
          {["Topwear", "Bottomwear", "Winterwear"].map((type) => (
            <div key={type} className="flex gap-5">
              <input type="checkbox" className="accent-gray-700" value={type} checked={selectedType.includes(type)} onChange={handleCheckboxChangetype}/>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">{type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="flex flex-col gap-3 w-full">
      <input type="text" placeholder="serch by name" value={searchTerm} className="max-h-14 sm:flex-1 outline-none  p-3 border-2 rounded-3xl" onChange={(e)=>setSearchTerm(e.target.value)} />

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 w-full">
          <div className="flex items-center">
            <p className="text-xl sm:py-3 lg:text-3xl text-gray-500">
              ALL <span className="text-gray-950">COLLECTIONS</span>
            </p>
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
          </div>
          <div>
            <select className="mt-1 block w-full p-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm font-medium"
             value={sortBy}
             onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-to-high">Sort by: Low to High</option>
              <option value="high-to-low">Sort by: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {filterItem.map((item, index) => (
              <Productitem key={index} id={item._id} image={item.image}name={item.name} price={item.price} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
