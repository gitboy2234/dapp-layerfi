const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

const PORT = process.env.PORT || 3001;

// Middleware to handle json body parsing
app.use(express.json());
app.use(
    cors({
        origin: "https://test.layerfi.net/",
    })
);

// Function to map network to chainId
const getChainId = (network) => {
    const networkMap = {
        BSC: "56",
        Ethereum: "1",
    };
    return networkMap[network] || "56"; // Default to BSC if network not found
};

app.get("/token-security", async (req, res) => {
    const network = req.query.network;
    const chainId = getChainId(network);
    const contractAddresses = req.query.contractAddresses;

    if (!contractAddresses) {
        return res
            .status(400)
            .send("contractAddresses query parameter is required");
    }

    try {
        const goplusResponse = await fetch(
            `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${contractAddresses}`
        );

        // Check if the response from GoPlus API was not OK (e.g., 400, 500 status codes)
        if (!goplusResponse.ok) {
            const errorResponse = await goplusResponse.json();
            console.error("Error from GoPlus API:", errorResponse);
            return res.status(500).json({
                error: `Failed to fetch data from GoPlus API: ${errorResponse.message}`,
            });
        }

        // If the response was OK, proceed to send back the data
        const data = await goplusResponse.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Server error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
