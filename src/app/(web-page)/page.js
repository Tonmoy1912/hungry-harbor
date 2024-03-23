import { TypingText } from "@/components/home-page-component/HomePageComponent";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full w-full ">
      <div className="flex flex-col justify-start items-center md:items-stretch md:flex-row md:justify-between bg-blue-900 md:-mb-8">
        <div className="w-full h-full md:w-1/2  justify-center pl-8 pt-20">
          <h1 className="text-transparent text-4xl bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 font-extrabold">Favourite Foods on Fingertips</h1>
          <TypingText />
          <div className="pt-8 ">
            <Link className=" px-2 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-600 text-lg text-white font-semibold" href={"/items"}  >Browse Items</Link>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center ">
          <Image src={"/images/hero-image.png"} className="opacity-100 " height={400} width={400} alt="hero-image" />
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#1E3A8A" fill-opacity="1" d="M0,128L48,154.7C96,181,192,235,288,234.7C384,235,480,181,576,138.7C672,96,768,64,864,80C960,96,1056,160,1152,165.3C1248,171,1344,117,1392,90.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
      </svg>

      <h1 className="pb-4 text-center text-2xl underline font-extrabold text-blue-800">How it works</h1>

      <div className="pb-10 flex flex-col gap-8 justify-start items-center">

        <div className="w-10/12 flex flex-col md:flex-row bg-slate-200 rounded-sm shadow-md shadow-slate-500">
          <div className="w-full md:w-2/5 flex justify-center items-center ">
            <Image src={"/images/searching.gif"} className="opacity-100 bg-green-400" height={400} width={400} alt="hero-image" />
          </div>
          <div className="w-full md:w-3/5 py-4 px-2">
            <h1 className="text-2xl font-bold text-blue-800 pb-3">Browse Items</h1>
            <p className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae explicabo esse reprehenderit voluptatem iusto, perspiciatis fugit aspernatur et odio ipsum praesentium quas alias quasi magni, dolorum magnam eligendi nulla dolores laudantium minima voluptates, a corporis. Laborum, nam. Ipsum nesciunt sint expedita dolores, consectetur numquam nisi aliquid in. Officia, est aliquid.
            </p>
          </div>
        </div>

        <div className="w-10/12 flex flex-col md:flex-row bg-slate-200 rounded-sm shadow-md shadow-slate-500">
          <div className="w-full md:w-2/5 flex justify-center items-center ">
            <Image src={"/images/order.png"} className="opacity-100 bg-green-400" height={400} width={400} alt="hero-image" />
          </div>
          <div className="w-full md:w-3/5 py-4 px-2">
            <h1 className="text-2xl font-bold text-blue-800 pb-3">Place Order</h1>
            <p className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae explicabo esse reprehenderit voluptatem iusto, perspiciatis fugit aspernatur et odio ipsum praesentium quas alias quasi magni, dolorum magnam eligendi nulla dolores laudantium minima voluptates, a corporis. Laborum, nam. Ipsum nesciunt sint expedita dolores, consectetur numquam nisi aliquid in. Officia, est aliquid.
            </p>
          </div>
        </div>

        <div className="w-10/12 flex flex-col md:flex-row bg-slate-200 rounded-sm shadow-md shadow-slate-500">
          <div className="w-full md:w-2/5 flex justify-center items-center ">
            <Image src={"/images/tracking.gif"} className="opacity-100 bg-green-400" height={400} width={400} alt="hero-image" />
          </div>
          <div className="w-full md:w-3/5 py-4 px-2">
            <h1 className="text-2xl font-bold text-blue-800 pb-3">Track Order</h1>
            <p className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae explicabo esse reprehenderit voluptatem iusto, perspiciatis fugit aspernatur et odio ipsum praesentium quas alias quasi magni, dolorum magnam eligendi nulla dolores laudantium minima voluptates, a corporis. Laborum, nam. Ipsum nesciunt sint expedita dolores, consectetur numquam nisi aliquid in. Officia, est aliquid.
            </p>
          </div>
        </div>

        <div className="w-10/12 flex flex-col md:flex-row bg-slate-200 rounded-sm shadow-md shadow-slate-500">
          <div className="w-full md:w-2/5 flex justify-center items-center ">
            <Image src={"/images/receive.png"} className="opacity-100 bg-green-400" height={400} width={400} alt="hero-image" />
          </div>
          <div className="w-full md:w-3/5 py-4 px-2">
            <h1 className="text-2xl font-bold text-blue-800 pb-3">Receive Order</h1>
            <p className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae explicabo esse reprehenderit voluptatem iusto, perspiciatis fugit aspernatur et odio ipsum praesentium quas alias quasi magni, dolorum magnam eligendi nulla dolores laudantium minima voluptates, a corporis. Laborum, nam. Ipsum nesciunt sint expedita dolores, consectetur numquam nisi aliquid in. Officia, est aliquid.
            </p>
          </div>
        </div>

        <div className="w-10/12 flex flex-col md:flex-row bg-slate-200 rounded-sm shadow-md shadow-slate-500">
          <div className="w-full md:w-2/5 flex justify-center items-center ">
            <Image src={"/images/review.png"} className="opacity-100 bg-green-400" height={400} width={400} alt="hero-image" />
          </div>
          <div className="w-full md:w-3/5 py-4 px-2">
            <h1 className="text-2xl font-bold text-blue-800 pb-3">Review </h1>
            <p className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae explicabo esse reprehenderit voluptatem iusto, perspiciatis fugit aspernatur et odio ipsum praesentium quas alias quasi magni, dolorum magnam eligendi nulla dolores laudantium minima voluptates, a corporis. Laborum, nam. Ipsum nesciunt sint expedita dolores, consectetur numquam nisi aliquid in. Officia, est aliquid.
            </p>
          </div>
        </div>

        <div className="w-10/12 flex flex-col md:flex-row bg-slate-200 rounded-sm shadow-md shadow-slate-500">
          <div className="w-full md:w-2/5 flex justify-center items-center ">
            <Image src={"/images/refunds.png"} className="opacity-100 bg-green-400" height={400} width={400} alt="hero-image" />
          </div>
          <div className="w-full md:w-3/5 py-4 px-2">
            <h1 className="text-2xl font-bold text-blue-800 pb-3">Refunds</h1>
            <p className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae explicabo esse reprehenderit voluptatem iusto, perspiciatis fugit aspernatur et odio ipsum praesentium quas alias quasi magni, dolorum magnam eligendi nulla dolores laudantium minima voluptates, a corporis. Laborum, nam. Ipsum nesciunt sint expedita dolores, consectetur numquam nisi aliquid in. Officia, est aliquid.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}



