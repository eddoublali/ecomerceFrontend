import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

export default function About() {
  return (
    <div>
        <div className="flex flex-col justify-center items-center gap-10 mb-20 md:flex">
          <div className="flex items-center gap-2 ">  
                <p className="text-3xl sm:py-3 lg:text-4xl leading-relaxed">ABOUT<span className="text-gray-500">US</span></p>
                <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            </div>
            <div className="flex flex-col md:flex-row gap-12 justify-center text-center md:text-start ">
              <img src={assets.about_img} alt="" className=" w-full md:w-1/2"/>
              <div  className="w-full md:w-1/3 flex flex-col gap-5 text-start">
                  <p className="text-xl text-gray-600">Forever was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.</p>
                  <p className="text-xl text-gray-600">Since our inception, we-ve worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.</p>
                  <p className="text-2xl">Our Mission</p>
                  <p className="text-xl text-gray-600">Our mission at Forever is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.</p>
              </div>
            </div>
         </div>
         <div className="flex items-center gap-2 ml-20 md:m-5 mb-5 ">  
                <p className="text-2xl md:text-3xl sm:py-3 lg:text-4xl leading-relaxed ">WHY CHOOSE<span className="text-gray-500">US</span></p>
                <p className="w-8 md:w-11 h-[2px] bg-[#414141] hidden md:block"></p>
            </div>
            <div  className="flex flex-col md:flex-row md:ml-20 mb-10">
              <div className="border md:p-20 p-10">
                <p className="text-2xl mb-2">Quality Assurance:</p>
                <p className="text-xl text-gray-600">We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
              </div>
              <div className="border md:p-20 p-10 ">
                <p className="text-2xl mb-2">Convenience: </p>
                <p className="text-xl text-gray-600">With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
              </div>
              <div className="border md:p-20 p-10">
                <p className="text-2xl mb-2">Exceptional Customer Service:</p>
                <p className="text-xl text-gray-600">Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
              </div>
            </div>
            <NewsletterBox/>
    </div>
  )
}
