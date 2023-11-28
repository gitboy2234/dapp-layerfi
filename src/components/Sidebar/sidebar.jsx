import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import logo from "../../assets/Images/logo2.png";
import "./sidebar.css";
import {
    HiHome,
    HiOutlineChartBar,
    HiOutlineShoppingCart,
} from "react-icons/hi";
import { IoMdQrScanner } from "react-icons/io";
import { RiTokenSwapLine } from "react-icons/ri";
import { FaTelegramPlane, FaTwitter, FaDiscord, FaBook } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { LuCandlestickChart } from "react-icons/lu";
import socialfi from "../../assets/Images/socialfi.png";

function Sidebar() {
    const [hideSidebar, setHideSideBar] = useState(true);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const toggleChecked = () => {
        setHideSideBar(!hideSidebar);
    };

    return (
        <div className="">
            <div className="sm:hidden lg:block showNav">
                <div className="w-full flex relative h-24  box-border justify-between ">
                    <div className="flex  mt-4 ">
                        <div className="mx-auto my-auto">
                            <img
                                className="h-[50px] pl-6"
                                alt="logo"
                                src={logo}
                            />
                        </div>
                        <div className="my-auto  ">
                            <span className="text-4xl main-font">LAYERFi</span>
                        </div>
                    </div>
                    <div className="mt-9 lg:ml-0 xl:ml-28  ">
                        <ul className="space-x-3 flex ">
                            <li
                                className={` rounded-lg bg-white  h-10 z-50 hover-effect ${
                                    isActive("/dashboard") ? "active-page" : ""
                                }`}>
                                <div className="slide-effect"></div>
                                <div className=" relative z-10">
                                    <Link
                                        className="mx-5 flex space-x-3"
                                        to="/dashboard">
                                        <HiHome size={35} />
                                        <span className="text-center text-xl my-auto">
                                            DASHBOARD
                                        </span>
                                    </Link>
                                </div>
                            </li>
                            <li
                                className={` rounded-lg bg-white mx-6 h-10 z-50 hover-effect ${
                                    isActive("/scanner") ? "active-page" : ""
                                }`}>
                                <div className="slide-effect"></div>
                                <div className=" relative z-10">
                                    <Link
                                        className="mx-5 flex space-x-3"
                                        to="/scanner">
                                        <IoMdQrScanner size={35} />
                                        <span className="text-center text-xl my-auto">
                                            SCANNER
                                        </span>
                                    </Link>
                                </div>
                            </li>
                            <li
                                className={` rounded-lg bg-white mx-6 h-10 z-50 hover-effect ${
                                    isActive("/stake") ? "active-page" : ""
                                }`}>
                                <div className="slide-effect"></div>
                                <div className="relative  z-10">
                                    <Link
                                        className="mx-5 flex space-x-3"
                                        to="/stake">
                                        <HiOutlineChartBar size={35} />
                                        <span className="text-center text-xl my-auto">
                                            STAKE
                                        </span>
                                    </Link>
                                </div>
                            </li>
                            <li
                                className={` rounded-lg bg-white mx-6 h-10 z-50 hover-effect ${
                                    isActive("/swap") ? "active-page" : ""
                                }`}>
                                <div className="slide-effect"></div>
                                <div className=" relative z-10">
                                    <Link
                                        className="mx-5 flex space-x-3"
                                        to="/swap">
                                        <RiTokenSwapLine size={35} />
                                        <span className="text-center text-xl my-auto">
                                            SWAP
                                        </span>
                                    </Link>
                                </div>
                            </li>
                            <li className=" rounded-lg bg-white mx-6 h-10 z-50 hover-effect">
                                <div className="slide-effect"></div>
                                <div className=" relative z-10">
                                    <Link
                                        className="mx-5 flex space-x-3"
                                        to="/market">
                                        <LuCandlestickChart size={35} />
                                        <span className="text-center text-sm font-semibold my-auto">
                                            MARKET TRACKER
                                        </span>
                                    </Link>
                                </div>
                            </li>
                            <li
                                className={` rounded-lg bg-white mx-6 h-10 z-50 hover-effect ${
                                    isActive("/social") ? "active-page" : ""
                                }`}>
                                <div className="slide-effect"></div>
                                <div className=" relative z-10">
                                    <Link
                                        className="mx-5 flex space-x-3"
                                        to="/social">
                                        <img
                                            src={socialfi}
                                            alt="socialfi"
                                            className="w-10"
                                        />
                                        <span className="text-center text-xl my-auto">
                                            SOCIALFI
                                        </span>
                                    </Link>
                                </div>
                            </li>
                            <li
                                className={` rounded-lg bg-white mx-6 h-10 z-50 hover-effect ${
                                    isActive("/buy") ? "active-page" : ""
                                }`}>
                                <div className="slide-effect"></div>
                                <div className=" relative  z-10">
                                    <Link
                                        className="mx-5 flex space-x-3"
                                        to="/buy">
                                        <HiOutlineShoppingCart size={35} />
                                        <span className="text-center lg:text-sm 2xl:text-xl my-auto">
                                            BUY LFIP
                                        </span>
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {hideSidebar ? (
                <div className="flex lg:hidden">
                    <div className="cursor-pointer hover:text-lime-400 sm:text-violet-500 absolute sm:left-0 sm:pt-10 sm:pr-4">
                        <GiHamburgerMenu size={30} onClick={toggleChecked} />
                    </div>
                </div>
            ) : (
                <div className="lg:hidden">
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-10"
                        onClick={toggleChecked}></div>
                    <div
                        className={`fixed inset-y-0 left-0 transform lg:hidden z-20 transition-transform duration-300 ease-in-out ${
                            hideSidebar ? "-translate-x-full" : "translate-x-0"
                        }`}>
                        <div className="sm:h-[600px] lg:h-[800px] absolute w-[270px] mx-4 my-5 border-2 border-violet-500 bg-white rounded-xl box-border">
                            <div className="flex mx-auto mt-4">
                                <div className="mx-auto my-auto">
                                    <img
                                        className="h-[50px] pl-6"
                                        alt="logo"
                                        src={logo}
                                    />
                                </div>
                                <div className="mx-auto my-auto pr-9 mt-2">
                                    <span className="text-4xl main-font">
                                        LAYERFi
                                    </span>
                                </div>
                            </div>
                            <div className="mt-8">
                                <ul className="space-y-2">
                                    <li
                                        className={`border-2 border-violet-300 rounded-lg bg-white mx-6 h-10 z-50 hover-effect ${
                                            isActive("/dashboard")
                                                ? "active-page"
                                                : ""
                                        }`}>
                                        <div className="slide-effect"></div>
                                        <div className=" absolute z-10">
                                            <Link
                                                className="mx-5 flex space-x-3"
                                                to="/dashboard">
                                                <HiHome size={35} />
                                                <span className="text-center text-xl my-auto">
                                                    DASHBOARD
                                                </span>
                                            </Link>
                                        </div>
                                    </li>
                                    <li
                                        className={`border-2 border-violet-300 rounded-lg bg-white mx-6 h-10 z-50 hover-effect ${
                                            isActive("/scanner")
                                                ? "active-page"
                                                : ""
                                        }`}>
                                        <div className="slide-effect"></div>
                                        <div className=" absolute z-10">
                                            <Link
                                                className="mx-5 flex space-x-3"
                                                to="/scanner">
                                                <IoMdQrScanner size={35} />
                                                <span className="text-center text-xl my-auto">
                                                    SCANNER
                                                </span>
                                            </Link>
                                        </div>
                                    </li>
                                    <li
                                        className={`border-2 border-violet-300 rounded-lg bg-white mx-6 h-10 z-50 hover-effect ${
                                            isActive("/stake")
                                                ? "active-page"
                                                : ""
                                        }`}>
                                        <div className="slide-effect"></div>
                                        <div className=" absolute z-10">
                                            <Link
                                                className="mx-5 flex space-x-3"
                                                to="/stake">
                                                <HiOutlineChartBar size={35} />
                                                <span className="text-center text-xl my-auto">
                                                    STAKE
                                                </span>
                                            </Link>
                                        </div>
                                    </li>
                                    <li
                                        className={`border-2 border-violet-300 rounded-lg bg-white mx-6 h-10 z-50 hover-effect ${
                                            isActive("/swap")
                                                ? "active-page"
                                                : ""
                                        }`}>
                                        <div className="slide-effect"></div>
                                        <div className=" absolute z-10">
                                            <Link
                                                className="mx-5 flex space-x-3"
                                                to="/swap">
                                                <RiTokenSwapLine size={35} />
                                                <span className="text-center text-xl my-auto">
                                                    SWAP
                                                </span>
                                            </Link>
                                        </div>
                                    </li>
                                    <li
                                        className={`border-2 border-violet-300 rounded-lg bg-white mx-6 h-10 z-50 hover-effect ${
                                            isActive("/market")
                                                ? "active-page"
                                                : ""
                                        }`}>
                                        <div className="slide-effect"></div>
                                        <div className=" absolute z-10">
                                            <Link
                                                className="mx-5 flex space-x-3"
                                                to="/market">
                                                <LuCandlestickChart size={35} />
                                                <span className="text-center text-sm font-semibold my-auto">
                                                    MARKET TRACKER
                                                </span>
                                            </Link>
                                        </div>
                                    </li>
                                    <li
                                        className={`border-2 border-violet-300 rounded-lg bg-white mx-6 h-10 z-50 hover-effect ${
                                            isActive("/social")
                                                ? "active-page"
                                                : ""
                                        }`}>
                                        <div className="slide-effect"></div>
                                        <div className=" absolute z-10">
                                            <Link
                                                className="mx-5 flex space-x-3"
                                                to="/social">
                                                <RiTokenSwapLine size={35} />
                                                <span className="text-center text-xl my-auto">
                                                    SOCIALFI
                                                </span>
                                            </Link>
                                        </div>
                                    </li>
                                    <li
                                        className={`border-2 border-violet-300 rounded-lg bg-white mx-6 h-10 z-50 hover-effect ${
                                            isActive("/buy")
                                                ? "active-page"
                                                : ""
                                        }`}>
                                        <div className="slide-effect"></div>
                                        <div className=" absolute z-10">
                                            <Link
                                                className="mx-5 flex space-x-3"
                                                to="/buy">
                                                <HiOutlineShoppingCart
                                                    size={35}
                                                />
                                                <span className="text-center text-xl my-auto">
                                                    BUY LAYER
                                                </span>
                                            </Link>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="mx-auto w-full  left-[0px] sm:bottom-24  absolute lg:bottom-2 text-center space-y-5 ">
                                <div>
                                    <span className="sub-font">Contact Us</span>
                                </div>
                                <div className="flex absolute mx-auto left-[70px] space-x-5 z-50">
                                    <a
                                        href="https://t.me/YourTelegramChannel"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        <FaTelegramPlane size={15} />
                                    </a>

                                    <a
                                        href="https://twitter.com/Layerfiofficial/"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        <FaTwitter size={15} />
                                    </a>

                                    <FaDiscord size={15} />
                                    <FaBook size={15} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
