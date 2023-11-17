import React, { useEffect } from "react";

const RedirectToBuy = ({ url }) => {
    useEffect(() => {
        window.location.href = url;
    }, [url]);

    return <div>Redirecting...</div>;
};

export default RedirectToBuy;
