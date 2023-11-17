import React, { useEffect } from "react";

const RedirectToMarketUrl = ({ url }) => {
    useEffect(() => {
        window.location.href = url;
    }, [url]);

    return <div>Redirecting...</div>;
};

export default RedirectToMarketUrl;
