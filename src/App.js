import React, { useState, useEffect } from "react";
import "./App.css";
import { useRoutes } from "react-router-dom";
import Scanner from "../src/pages/Scanner/scanner";
import FloozWidget from "../src/pages/swap/swap";
import RedirectToExternalUrl from "../src/components/RedirectToExternalUrl";
import RedirectToBuy from "../src/components/RedirectToBuyUrl";
import RedirectToMarketUrl from "../src/components/RedirectToMarketUrl";
import Soon from "../src/pages/Soon/soon";
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
        const fadeOutTimer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        const loaderHideTimer = setTimeout(() => {
            setShowLoader(false);
        }, 4000);

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(loaderHideTimer);
        };
    }, []);

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
