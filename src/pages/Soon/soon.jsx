import React from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import "./soon.css";

function Soon() {
    return (
        <div className=" z-50 relative w-full ">
            <div className="z-50 relative">
                <Sidebar />
            </div>
            <div className="relative row-span-2">
                <div className=" relative text-center pt-10 main-font tracking-widest sm:ml-[250px] lg:ml-[650px]">
                    <span className=" text-7xl text-violet-500 ">OPPPS! </span>

                    <br />
                    <span>This Page Will be Available Soon!</span>
                </div>
            </div>
        </div>
    );
}

export default Soon;
