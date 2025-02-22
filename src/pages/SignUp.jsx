import { Link } from 'react-router-dom';
import { useRegister } from '../context/RegisterProvider';
import { useState } from 'react';

export default function SignUp() {
  const [input, setInput] = useState({
    email: "",
    username: "",
    password: "",
  });
  const { RegisterAction } = useRegister();  // Corrected hook usage

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (input.email !== "" && input.password !== "") {
      try {
        await RegisterAction(input); // This calls the RegisterAction
        alert('Registration successful! Redirecting to login...');
      } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
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
      <div className="flex items-center gap-2 ">
        <p className="text-3xl font-medium mb-5 prata-regular ">Sign Up</p>
        <p className="w-8 md:w-11 h-[2px] bg-[#414141] "></p>
      </div>
      <form onSubmit={onSubmitHandler} className="w-full sm:w-1/3 flex flex-col items-center  md:gap-5 mx-auto  pl-3 ">
        <input 
          type="text" 
          placeholder="Enter your Name"  
          className="w-full sm:flex-1 outline-none border p-3  border-slate-950" 
          required 
          value={input.username} 
          onChange={handleInput}
          name="username" // Add name attribute to match the state key
        /><br />
        
        <input 
          type="email" 
          placeholder="Enter your Email"  
          className="w-full sm:flex-1 outline-none border p-3  border-slate-950" 
          required 
          value={input.email} 
          onChange={handleInput}
          name="email"  // Add name attribute to match the state key
        /><br />
        
        <input 
          type="password" 
          placeholder="Enter your Password"  
          className="w-full sm:flex-1 outline-none border p-3 border-slate-950" 
          required  
          value={input.password} 
          onChange={handleInput}
          name="password" // Add name attribute to match the state key
        />
        
        <div className="flex gap-10 md:gap-28 items-center mt-2 mb-4  md:mb-0 md:mt-0">
          <p className="cursor-pointer">Forgot your password?</p>
          <Link to='/login'>
            <p className="cursor-pointer">Login Here</p>
          </Link>
        </div>
        
        <button type="submit" className="bg-black text-x text-white px-10 py-4 mt-2">Sign Up</button>
      </form>
    </div>
  );
}
