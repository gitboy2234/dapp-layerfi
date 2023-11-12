import React from "react";

import "./scanner.css";
import logo from "../../assets/Images/logo2.png";
import TextField from "@mui/material/TextField";
import { IoMdQrScanner } from "react-icons/io";
import Sidebar from "../../components/Sidebar/sidebar";
import Box from "@mui/material/Box";
function Scanner() {
    return (
        <div className="">
            <div className="z-50 relative">
                <Sidebar />
            </div>

            <div className="relative row-span-2">
                <div className=" relative text-center pt-10 main-font tracking-widest sm:ml-[150px] lg:ml-[650px]">
                    <span className=" text-7xl text-violet-500 ">LAYERFi </span>
                    <span className=" text-7xl border-b-2  border-cyan-600">
                        PROTOCOL
                    </span>
                    <br />
                    <span>The First Autonomous Protocol on Multi Network</span>
                </div>
            </div>
            <div className="relative mt-10 px-2 w-full ">
                <div className=" h-3/4 border-2 bg-white rounded-xl  mx-auto sm:w-3/4 md:w-1/2 lg:ml-[300px] xl:ml-[500px]  py-5">
                    <div className="flex border-b-2 border-violet-300">
                        <img className="h-[30px] pl-6" alt="logo" src={logo} />
                        <span className="my-auto mx-2 sub-font">
                            LAYERFI SCANNER
                        </span>
                    </div>

                    <div className="mx-5 ">
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "flex-end",
                                width: "full",
                            }}>
                            <div className="mx-5">
                                <IoMdQrScanner size={35} />
                            </div>
                            <TextField
                                id="input-with-sx"
                                label="CA"
                                variant="standard"
                                fullWidth
                            />
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Scanner;
