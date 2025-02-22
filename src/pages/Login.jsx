import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const auth = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (input.email !== "" && input.password !== "") {
      try {
        await auth.loginAction(input);
      } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please try again.');
      }
      return;
    }
    alert("Please provide valid input");
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center mt-20 w-full">  
      <div className="flex items-center gap-2">
        <p className="text-3xl font-medium mb-5 prata-regular">Login</p>  
        <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
      </div>
      <form onSubmit={onSubmitHandler} className="w-full sm:w-1/3 flex flex-col items-center md:gap-5 mx-auto pl-3">
          <input 
            type="email" 
            name="email"
            value={input.email}
            placeholder="Enter your Email"  
            className="w-full sm:flex-1 outline-none border p-3 border-slate-950" 
            required  
            onChange={handleInput}
          />
          <br />
          <input 
            type="password" 
            name="password"
            value={input.password}
            placeholder="Enter your Password"  
            className="w-full sm:flex-1 outline-none border p-3 border-slate-950" 
            required  
            onChange={handleInput}
          />
          <div className="flex gap-10 md:gap-28 items-center mt-2 mb-4 md:mb-0 md:mt-0">
            <p className="cursor-pointer">Forgot your password?</p>
            <Link to='/register'>
              <p className="cursor-pointer">Create account</p>
            </Link>
          </div>
          <button type="submit" className="bg-black text-x text-white px-10 py-4 mt-2">
            Sign In
          </button>
      </form>
    </div>
  );
}