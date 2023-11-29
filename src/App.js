import React, { useState, useEffect } from "react";
import "./App.css";
import { useRoutes, useLocation } from "react-router-dom";
import Scanner from "../src/pages/Scanner/scanner";
import RedirectToSwapUrl from "../src/components/RedirectToSwapUrl";
import RedirectToExternalUrl from "../src/components/RedirectToExternalUrl";
import RedirectToBuy from "../src/components/RedirectToBuyUrl";
import RedirectToMarketUrl from "../src/components/RedirectToMarketUrl";
import Soon from "../src/pages/Soon/soon";
import { helix } from "ldrs";

function App() {
    helix.register();
    const [loading, setLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(true);
    const location = useLocation();
    const [path, setPath] = useState(location.pathname);
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
            element: <RedirectToSwapUrl url="https://swap.layerfi.net/" />,
        },
        {
            path: "/buy",
            element: (
                <RedirectToBuy url="https://pancakeswap.finance/swap?outputCurrency=0xA7278e14aedDCaE50315166DA9c1869653830023" />
            ),
        },
        {
            path: "/stake",
            element: <Soon />,
        },
        {
            path: "/market",
            element: <RedirectToMarketUrl url="https://market.layerfi.net/" />,
        },
        {
            path: "/social",
            element: <Soon />,
        },
    ]);

    useEffect(() => {
        // Show loader on route change
        setShowLoader(true);
        setLoading(true);

        // Hide loader after a delay
        const loaderHideTimer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        const fadeOutTimer = setTimeout(() => {
            setShowLoader(false);
        }, 4000);

        return () => {
            clearTimeout(loaderHideTimer);
            clearTimeout(fadeOutTimer);
        };
    }, [path]);

    useEffect(() => {
        setPath(location.pathname);
    }, [location]);

    return (
        <div className="">
            {showLoader && (
                <div
                    className={`fixed inset-0 bg-black flex justify-center items-center ${
                        loading ? "" : "fade-out"
                    }`}>
                    <l-helix size="150" speed="5" color="purple"></l-helix>
                </div>
            )}
            <div className={`${loading ? "hidden" : ""}`}>
                <div className="content">{element}</div>
            </div>
        </div>
    );
}

export default App;
