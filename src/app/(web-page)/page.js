import { TypingText } from "@/components/home-page-component/HomePageComponent";
import { StopProgress } from "@/components/util/util";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full w-full ">
      <StopProgress />
      <div className="flex flex-col justify-start items-center md:items-stretch md:flex-row md:justify-between bg-blue-900 md:-mb-8">
        <div className="w-full h-full md:w-1/2  justify-center pl-8 pt-20">
          <h1 className="text-transparent text-4xl bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 font-extrabold">Favourite Foods on Fingertips</h1>
          <TypingText />
          <div className="pt-8 ">
            <Link className=" px-2 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-600 text-lg text-white font-semibold" href={"/items"}  >Browse Items</Link>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center ">
          <Image src={"/images/hero-image.png"} className="" height={400} width={400} alt="hero-image" />
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#1E3A8A" fillOpacity={"1"} d="M0,128L48,154.7C96,181,192,235,288,234.7C384,235,480,181,576,138.7C672,96,768,64,864,80C960,96,1056,160,1152,165.3C1248,171,1344,117,1392,90.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
      </svg>

      <div className="p-4 w-10/12 m-auto my-4 text-yellow-700 bg-slate-200 rounded-md shadow-md shadow-slate-500 font-semibold text-lg">
        Note: This is a hobby project and not associated with any business.The the payment methods are in test mode, hence there will be no transfer of actual money.
      </div>

      <h1 className="pb-4 text-center text-2xl underline font-extrabold text-blue-800">How it works</h1>

      <div className="pb-10 flex flex-col gap-8 justify-start items-center">

        <div className="w-10/12 flex flex-col md:flex-row bg-slate-200 rounded-sm shadow-md shadow-slate-500">
          <div className="w-full md:w-2/5 flex justify-center items-center ">
            <Image src={"/images/searching.gif"} className=" bg-green-400" height={400} width={400} alt="hero-image" />
          </div>
          <div className="w-full md:w-3/5 py-4 px-2">
            <h1 className="text-2xl font-bold text-blue-800 pb-3">Browse Items</h1>
            <ul className="list-disc px-4 py-2 flex flex-col gap-2">
              <li>Browse the items.</li>
              <li>Filter items by category and search items by name.</li>
              <li>Add your favourite items in wishlist.</li>
              <li>Add items to cart to place order.</li>
            </ul>
            <Link className=" px-1.5 py-1 rounded-md bg-blue-700 hover:bg-blue-600 text-sm text-white font-semibold" href={"/items"}  >Browse Items</Link>
          </div>
        </div>

        <div className="w-10/12 flex flex-col md:flex-row bg-slate-200 rounded-sm shadow-md shadow-slate-500">
          <div className="w-full md:w-2/5 flex justify-center items-center ">
            <Image src={"/images/order.png"} className=" bg-green-400" height={400} width={400} alt="hero-image" />
          </div>
          <div className="w-full md:w-3/5 py-4 px-2">
            <h1 className="text-2xl font-bold text-blue-800 pb-3">Place Order</h1>
            <ul className="list-disc px-4 py-2 flex flex-col gap-2">
              <li>Placed order via cart.</li>
              <li>Make payment using UPI, Netbanking and Card through secure payment gateway provided by Razorpay.</li>
            </ul>
            <Link className=" px-1.5 py-1 rounded-md bg-blue-700 hover:bg-blue-600 text-sm text-white font-semibold" href={"/cart"}  >Place Order</Link>
          </div>
        </div>

        <div className="w-10/12 flex flex-col md:flex-row bg-slate-200 rounded-sm shadow-md shadow-slate-500">
          <div className="w-full md:w-2/5 flex justify-center items-center ">
            <Image src={"/images/tracking.gif"} className=" bg-green-400" height={400} width={400} alt="hero-image" />
          </div>
          <div className="w-full md:w-3/5 py-4 px-2">
            <h1 className="text-2xl font-bold text-blue-800 pb-3">Track Order</h1>
            <ul className="list-disc px-4 py-2 flex flex-col gap-2">
              <li>Track your order in realtime.</li>
              <li>Get instant notification on order processing.</li>
              <li>Browse your previous order history.</li>
            </ul>
            <Link className=" px-1.5 py-1 rounded-md bg-blue-700 hover:bg-blue-600 text-sm text-white font-semibold" href={"/orders"}  >Track Orders</Link>
          </div>
        </div>

        {/* <div className="w-10/12 flex flex-col md:flex-row bg-slate-200 rounded-sm shadow-md shadow-slate-500">
          <div className="w-full md:w-2/5 flex justify-center items-center ">
            <Image src={"/images/receive.png"} className=" bg-green-400" height={400} width={400} alt="hero-image" />
          </div>
          <div className="w-full md:w-3/5 py-4 px-2">
            <h1 className="text-2xl font-bold text-blue-800 pb-3">Receive Order</h1>
            <p className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae explicabo esse reprehenderit voluptatem iusto, perspiciatis fugit aspernatur et odio ipsum praesentium quas alias quasi magni, dolorum magnam eligendi nulla dolores laudantium minima voluptates, a corporis. Laborum, nam. Ipsum nesciunt sint expedita dolores, consectetur numquam nisi aliquid in. Officia, est aliquid.
            </p>
          </div>
        </div> */}

        <div className="w-10/12 flex flex-col md:flex-row bg-slate-200 rounded-sm shadow-md shadow-slate-500">
          <div className="w-full md:w-2/5 flex justify-center items-center ">
            <Image src={"/images/review.png"} className=" bg-green-400" height={400} width={400} alt="hero-image" />
          </div>
          <div className="w-full md:w-3/5 py-4 px-2">
            <h1 className="text-2xl font-bold text-blue-800 pb-3">Review </h1>
            <ul className="list-disc px-4 py-2 flex flex-col gap-2">
              <li>See the reviews and rating of any item.</li>
              <li>Submit your own reviews about any item.</li>
            </ul>
          </div>
        </div>

        {/* <div className="w-10/12 flex flex-col md:flex-row bg-slate-200 rounded-sm shadow-md shadow-slate-500">
          <div className="w-full md:w-2/5 flex justify-center items-center ">
            <Image src={"/images/refunds.png"} className=" bg-green-400" height={400} width={400} alt="hero-image" />
          </div>
          <div className="w-full md:w-3/5 py-4 px-2">
            <h1 className="text-2xl font-bold text-blue-800 pb-3">Refunds</h1>
            <p className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae explicabo esse reprehenderit voluptatem iusto, perspiciatis fugit aspernatur et odio ipsum praesentium quas alias quasi magni, dolorum magnam eligendi nulla dolores laudantium minima voluptates, a corporis. Laborum, nam. Ipsum nesciunt sint expedita dolores, consectetur numquam nisi aliquid in. Officia, est aliquid.
            </p>
          </div>
        </div> */}

      </div>
    </div>
  )
}



