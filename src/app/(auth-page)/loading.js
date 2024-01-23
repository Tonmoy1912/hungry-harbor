
export default function Loading() {
    return (
        <div className="h-screen w-screen flex justify-center items-center bg-gray-900">
            <div className='min-h-96 min-w-72 sm:min-h-[430px] sm:w-[400px] p-10 backdrop-blur-2xl backdrop-brightness-90  rounded-lg shadow-sm shadow-slate-200 flex justify-center items-center'>
                <LodingSkeleton/>
            </div>
        </div>
      );
  }
  
  function LodingSkeleton(){
    return (
        <div className=" rounded-md p-4 max-w-sm w-full mx-auto">
          <div className="animate-pulse flex-col justify-center gap-10 items-center space-x-4">
  
            <div className="w-full h-20 pb-20 flex justify-center items-center">
                <div className="rounded-full bg-slate-700 h-16 w-16"></div>
            </div>
            
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
  
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
  
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
  
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      );
  }