import React, { useState, useEffect } from "react";
import "./App.css";
import "../src/components/Sidebar/sidebar";
import { useRoutes } from "react-router-dom";
import FloozWidget from "../src/pages/swap/swap";
import RedirectToExternalUrl from "../src/components/RedirectToExternalUrl";
import homevideo from "../src/assets/Video/homevid.mp4";
import Scanner from "../src/pages/Scanner/scanner";
import { helix } from "ldrs";

function App() {
    helix.register();
    const [loading, setLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(true);

    let element = useRoutes([
        {
            path: "/",
            element: <Scanner />,
        },
        {
            path: "/dashboard",
            element: <RedirectToExternalUrl url="https://layerfi.net/" />,
        },
        {
            path: "/scanner",
            element: <Scanner />,
        },
        {
            path: "/swap",
            element: <FloozWidget />,
        },
    ]);
    useEffect(() => {
        const fadeOutTimer = setTimeout(() => {
            setLoading(false);
        }, 3000); // Duration until fade-out starts

        const loaderHideTimer = setTimeout(() => {
            setShowLoader(false);
        }, 4000); // Duration until loader is completely hidden

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(loaderHideTimer);
        };
    }, []);

    return (
        <div>
            {showLoader && (
                <div
                    className={`fixed inset-0 bg-black flex justify-center items-center ${
                        loading ? "" : "fade-out"
                    }`}>
                    <l-helix size="150" speed="5" color="purple"></l-helix>
                </div>
            )}
            <div className={`${loading ? "hidden" : ""}`}>
                <div className="fade  curve  z-0 bg-cover fixed">
                    <div className="relative bg-cover bg-opacity-80 bg-black z-10">
                        <video autoPlay loop muted id="video" className="z-0">
                            <source src={homevideo} type="video/mp4" />
                        </video>
                    </div>
                </div>

                <div
                    className={`z-10 ${
                        loading
                            ? "opacity-0"
                            : "opacity-100 transition-opacity duration-1000"
                    }`}>
                    {element}
                </div>
            </div>
        </div>
    );
}

export default App;
