export default function NewsletterBox() {

    const onSubmitHandler=(e)=>{
        e.preventDefault();
    }

  return (
    <div className="text-center">
        <p className="text-2xl font-medium text-gary-800">Subscribe now and get 20% off</p>
        <p className="text-gray-400 mt-3 mb-8 m-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi accusantium</p>
    <form onSubmit={onSubmitHandler} className="w-full sm:w-1/2 flex items-center gap-3 mx-auto border pl-3">
        <input type="email" placeholder="Enter your Email"  className="w-full sm:flex-1 outline-none" required/>
        <button type="submit" className="bg-black text-xs text-white px-10 py-4">SUBSCRIB</button>
    </form>
   
    </div>
  )
}
