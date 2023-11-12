import React from "react";
import Sidebar from "../../components/Sidebar/sidebar";
function FloozWidget() {
    return (
        <div className=" z-50 relative w-full ">
            <div className="z-50 relative">
                <Sidebar />
            </div>
            <div className="relative row-span-2">
                <div className=" relative text-center pt-10 main-font tracking-widest sm:ml-[250px] lg:ml-[650px]">
                    <span className=" text-7xl text-violet-500 ">SWAP </span>

                    <br />
                    <span>The First Autonomous Protocol on Multi Network</span>
                </div>
            </div>
            <div>
                <div className="relative mx-auto sm:ml-[20px] md:ml-[240px] lg:ml-[500px] xl:ml-[700px] 2xl:ml-[850px] pt-9">
                    <iframe
                        title="swap"
                        className=" sm:w-[350px] sm:h-[650px] lg:w-[400px] h-[650px]"
                        allow="clipboard-read *; clipboard-write *; web-share *; accelerometer *; autoplay *; camera *; gyroscope *; payment *; geolocation *"
                        src="https://flooz.xyz/embed/trade?swapDisabled=false&swapLockToToken=true&onRampDisabled=true&onRampAsDefault=false&onRampTokenAddress=bnb&onRampLockToken=false&stakeDisabled=false&network=bsc&lightMode=false&primaryColor=%239704e7&backgroundColor=transparent&roundedCorners=18&padding=31&refId=A5Q5zU"></iframe>
                </div>
            </div>
        </div>
    );
}

export default FloozWidget;
