"use client";

export default function Home() {
  function clickHandler(){
    fetch("/api/testapi",{cache:"no-store"})
    .then(data=>data.json()).then(data=>console.log(data));
  }
  return (
    <button onClick={clickHandler} className="p-12">hello world</button>
  )
  
}



