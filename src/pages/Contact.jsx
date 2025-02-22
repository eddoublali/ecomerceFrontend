import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

export default function Contact() {
  return (
    <>
    <div className="flex flex-col justify-center items-center gap-10 mb-20 md:flex">
       <div className="flex items-center gap-2 ">  
                <p className="text-3xl sm:py-3 lg:text-4xl leading-relaxed">CONTACT <span className="text-gray-500">US</span></p>
                <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            </div>
            <div className="flex flex-col md:flex-row gap-12 justify-center text-center md:text-start ">
              <img src={assets.contact_img} alt="" className=" w-full md:w-1/2"/>
              <div className="flex flex-col gap-10">
                <p   className="text-3xl sm:py-3 lg:text-4xl leading-relaxed">Our Store</p>
                <div>
                  <p className="text-xl text-gray-600">54709 Willms Station</p>
                  <p className="text-xl text-gray-600">Suite 350, Washington, USA</p>
                </div>
                <div>
                  <p className="text-xl text-gray-600">Tel: (415) 555-0132  </p>
                  <p className="text-xl text-gray-600">Email: admin@forever.com</p>
                </div>
                <p  className="text-3xl sm:py-3 lg:text-4xl leading-relaxed">Careers at Forever</p>
                <p className="text-xl text-gray-600">Learn more about our teams and job openings.</p>
                <button className="hover:bg-black text-xl hover:text-white px-10 py-4 mt-2 border border-2">Explore Jobs</button>
              </div>
            </div>
           
    </div>
    <NewsletterBox/>
  
    </>
  )
}
