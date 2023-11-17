import React from "react";
import Sidebar from "../../components/Sidebar/sidebar";
function FloozWidget() {
    return (
        <div className=" z-50 relative w-full ">
            <div className="z-50 relative">
                <Sidebar />
            </div>
            <div className="relative row-span-2">
                <div className=" relative text-center pt-10 main-font tracking-widest sm:ml-[30px] lg:ml-[650px]">
                    <span className=" text-7xl text-violet-500 ">
                        PAGE MAINTENANCE{" "}
                    </span>

                    <br />
                    <span>THIS PAGE WILL BE BACK SOON.</span>
                </div>
            </div>
        </div>
    );
}

export default FloozWidget;
