import React, { useEffect } from "react";

const RedirectToSwapUrl = ({ url }) => {
    useEffect(() => {
        window.location.href = url;
    }, [url]);

    return <div>Redirecting...</div>;
};

export default RedirectToSwapUrl;
