import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useAuth } from "../context/AuthProvider";

export default function Navbar() {
  const { cart } = useContext(ShopContext);
  const { user, isAuthenticated, isAdmin, logOut } = useAuth();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to='/'><img src={assets.logo} className="w-36" alt="" /></Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <div className="group relative">
          <img
            src={assets.profile_icon}
            alt="Profile"
            className="w-5 cursor-pointer"
          />
          <div className="group-hover:block hidden absolute right-0 pt-4 z-10">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link to="/dashboard" className="cursor-pointer hover:text-black">
                      Dashboard
                    </Link>
                  )}
                  <Link to="/orders" className="cursor-pointer hover:text-black">
                    My Orders
                  </Link>
                  <Link to="/profile" className="cursor-pointer hover:text-black">
                    Profile
                  </Link>
                  <p onClick={handleLogout} className="cursor-pointer hover:text-black">
                    Logout
                  </p>
                </>
              ) : (
                <>
                  <p onClick={handleLogin} className="cursor-pointer hover:text-black">
                    Login
                  </p>
                  <Link to="/register" className="cursor-pointer hover:text-black">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cart Button */}
        <Link to='/orders'>
          <div className="relative">
            <img
              src={assets.cart_icon}
              alt=""
              className="w-5 min-w-5 cursor-pointer"
            />
            <p className="cursor-pointer absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white rounded-full text-[8px] aspect-square">
              {cart.length}
            </p>
          </div>
        </Link>

        {/* Sidebar Menu for Small Screens */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt=""
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>

      {/* Mobile Sidebar Menu */}
      <div className={`absolute top-0 z-10 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className="flex flex-col text-gray-600">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="Back" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
          
          {isAuthenticated && (
            <>
              <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/orders'>MY ORDERS</NavLink>
              <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/profile'>PROFILE</NavLink>
              {isAdmin && (
                <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/dashboard'>DASHBOARD</NavLink>
              )}
              <div onClick={() => { setVisible(false); logOut(); }} className='py-2 pl-6 border cursor-pointer'>LOGOUT</div>
            </>
          )}
          
          {!isAuthenticated && (
            <>
              <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/login'>LOGIN</NavLink>
              <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/register'>REGISTER</NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}