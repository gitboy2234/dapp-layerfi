import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./scanner.css";
import BigInt from "bignumber.js";
import logo from "../../assets/Images/logo2.png";
import TextField from "@mui/material/TextField";

import Sidebar from "../../components/Sidebar/sidebar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { TbDiscountCheckFilled, TbAlertOctagonFilled } from "react-icons/tb";
import CircularProgress from "@mui/material/CircularProgress";
import { InputAdornment } from "@mui/material";
function Scanner() {
    const [contractAddress, setContractAddress] = useState("");
    const [verificationStatus, setVerificationStatus] = useState("");
    const [contractAnalysis, setContractAnalysis] = useState([]);
    const [honeypotAnalysis, setHoneypotAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [network, setNetwork] = useState("BSC");
    const [web3, setWeb3] = useState(null);
    const [tokenDetails, setTokenDetails] = useState(null);
    const [hasInput, setHasInput] = useState(false);

    const [hasScanned, setHasScanned] = useState(false);

    useEffect(() => {
        let provider;
        if (network === "Ethereum") {
            provider =
                "https://mainnet.infura.io/v3/e869620b99334119bba095c34ccb8558";
        } else {
            provider =
                "https://skilled-aged-replica.bsc.quiknode.pro/fa781ac0e208b4f43499a55709c6af36b7784544/";
        }
        setWeb3(new Web3(provider));
    }, [network]);

    const getApiEndpoint = (network, contractAddress, type) => {
        const apiKey =
            network === "Ethereum"
                ? "FUMHTQE96FPWIW79ZJFCIXFX5BPCGNQC7T"
                : "JUDPV627WC6YPRF9PJ992PQ4MMAIZVCDVV";
        const baseUrl =
            network === "Ethereum"
                ? "https://api.etherscan.io/api"
                : "https://api.bscscan.com/api";

        switch (type) {
            case "abi":
                return `${baseUrl}?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
            case "tx":
                return `${baseUrl}?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
            case "source":
                return `${baseUrl}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`;
            default:
                return "";
        }
    };

    const scanContract = async () => {
        setIsLoading(true);
        setHasScanned(true);
        if (!contractAddress) {
            alert("Please enter a contract address.");
            setIsLoading(false);
            return;
        }
        const tokenSecurityData = await fetchTokenSecurityData(
            contractAddress,
            network
        );

        if (tokenSecurityData) {
        }

        const abiUrl = getApiEndpoint(network, contractAddress, "abi");
        const txUrl = getApiEndpoint(network, contractAddress, "tx");
        const sourceUrl = getApiEndpoint(network, contractAddress, "source");

        try {
            const abiResponse = await fetch(abiUrl);
            const abiData = await abiResponse.json();

            if (abiData.status !== "1") {
                setVerificationStatus("NOT A VALID CONTRACT");
                setContractAnalysis([]);
                setIsLoading(false);
                setHoneypotAnalysis(null);
                return;
            }

            setVerificationStatus("This contract is verified.");
            const ABI = JSON.parse(abiData.result);
            const contract = new web3.eth.Contract(ABI, contractAddress);

            const txResponse = await fetch(txUrl);
            const txData = await txResponse.json();
            const creatorAddress = txData.result[0].from;

            const sourceResponse = await fetch(sourceUrl);
            const sourceData = await sourceResponse.json();

            let analysisLines = [];

            if (sourceData.status === "1" && sourceData.result.length > 0) {
                const sourceCode = sourceData.result[0].SourceCode;

                const creatorBalance = new BigInt(
                    await contract.methods.balanceOf(creatorAddress).call()
                );
                const totalSupply = new BigInt(
                    await contract.methods.totalSupply().call()
                );
                const creatorPercentage =
                    (creatorBalance * new BigInt(100)) / totalSupply;

                analysisLines.push({
                    text: "Contract Analysis Report:",
                    className: "text-2xl text-yellow-500",
                });

                if (sourceCode.includes("transferOwnership")) {
                    analysisLines.push({
                        text: "Contract has 'transferOwnership' function.",
                        className: "text-orange-800",
                    });
                    analysisLines.push({
                        text: "🔍 This function allows the contract owner to transfer ownership, potentially to a dead address to renounce control. While offering flexibility, it's important to monitor its use to ensure fair and decentralized governance.",
                        className: "text-sm text-white",
                    });
                } else {
                    analysisLines.push({
                        text: " No 'transferOwnership' function found.",
                        className: "text-green-500",
                    });
                    analysisLines.push({
                        text: "✅ The absence of this function means ownership cannot be easily transferred or renounced. This can enhance the contract's security by ensuring stability in governance.",
                        className: "text-sm text-white",
                    });
                }

                const hasTaxFunctions =
                    sourceCode.includes("setBuyTax") ||
                    sourceCode.includes("setSellTax");

                analysisLines.push({
                    text: hasTaxFunctions
                        ? "Contract has Tax fee modifier functions."
                        : "No fee modifier functions found.",
                    className: hasTaxFunctions
                        ? "text-orange-800"
                        : "text-green-500",
                });

                if (hasTaxFunctions) {
                    analysisLines.push({
                        text: "🔍 The contract includes functions for adjusting buy/sell taxes, which are mechanisms often utilized to influence trading behavior, provide liquidity, reward holders, or fund project development. While these features offer flexibility, it is crucial for token holders to stay informed about any tax rate changes, as they can affect transaction costs and overall token economics.",
                        className: "text-sm text-white",
                    });
                } else {
                    analysisLines.push({
                        text: "✅ The contract does not have functions to modify buy/sell taxes. This could indicate a more stable transaction environment as token holders won't experience variable tax rates that could affect their trading strategy. The absence of such functions might also reflect a commitment to a fixed transaction policy, enhancing predictability for token holders.",
                        className: "text-sm text-white",
                    });
                }

                // First, add the basic information with dynamic coloring based on the percentage
                analysisLines.push({
                    text: `Creator holds ${creatorPercentage.toString()}% of tokens.`,
                    className:
                        creatorPercentage > 5
                            ? "text-red-500"
                            : "text-green-500",
                });

                if (creatorPercentage > 5) {
                    analysisLines.push({
                        text: "⚠️ The creator holds more than 5% of the total token supply, which indicates a higher level of control over the token's market. It's important to consider this factor when assessing the potential for market influence.",
                        className: "text-sm text-red-500",
                    });
                } else {
                    analysisLines.push({
                        text: "✅ Ownership is decentralized – the creator possesses less than 5% of the total token supply, promoting fair distribution and minimizing the risk of market manipulation.",
                        className: "text-sm text-white",
                    });
                }
            } else {
                setContractAnalysis([
                    "Unable to fetch or analyze contract source code.",
                ]);
                setIsLoading(false);
                setHasScanned(true);
                return;
            }

            try {
                const isPaused = await contract.methods.paused().call();
                analysisLines.push({
                    text: `❌ Contract is ${
                        isPaused
                            ? "paused the trading on this pair"
                            : "not paused but it can be paused"
                    }.`,
                    className: isPaused ? "text-red-500" : "text-green-500",
                });
                analysisLines.push({
                    text: "⚠️ Please be carefull, this contract does  contain functions that could unexpectedly halt your transactions. Your trading activities can be interrupted.",
                    className: "text-sm text-white",
                });
            } catch (error) {
                analysisLines.push({
                    text: "  No Pausable Function",
                    className: "text-green-500",
                });
                analysisLines.push({
                    text: "✅ Rest assured, this contract does not contain functions that could unexpectedly halt your transactions. Your trading activities remain uninterrupted.",
                    className: "text-sm text-white",
                });
            }

            setContractAnalysis(analysisLines);
        } catch (error) {
            console.error("Error in scanning contract:", error);
            setVerificationStatus("Error during scanning.");
            setContractAnalysis(["Error during source code analysis."]);
            setHoneypotAnalysis(null);
        } finally {
            setIsLoading(false);
        }

        await checkHoneypot();
    };
    const truncateAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(
            address.length - 4
        )}`;
    };

    const formatBalance = (balance) => {
        return parseInt(balance).toLocaleString(); // Converts to a whole number and formats with commas
    };

    const formatPercentage = (percent) => {
        return (parseFloat(percent) * 100).toFixed(2); // Converts to a percentage and fixes to 2 decimal places
    };
    const formatAddress = (address) => {
        return window.innerWidth < 640
            ? address.slice(0, 30) + "<br />" + address.slice(15)
            : address;
    };
    const handleInputChange = (e) => {
        setContractAddress(e.target.value);
        if (e.target.value.trim() !== "") {
            setHasInput(true);
        }
    };

    const fetchTokenSecurityData = async (contractAddress, network) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://dapp.layerfi.net/token-security?network=${network}&contractAddresses=${contractAddress}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (!data.result || !data.result[contractAddress.toLowerCase()]) {
                setTokenDetails(null);
                return null;
            }
            setTokenDetails(data.result[contractAddress.toLowerCase()]);
            return data.result[contractAddress.toLowerCase()].holders;
        } catch (error) {
            console.error("Error fetching token security data:", error);
            setError(
                error.message || "An error occurred while fetching token data."
            );
            setTokenDetails(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const checkHoneypot = async () => {
        setIsLoading(true);
        const honeypotUrl = `https://api.honeypot.is/v2/IsHoneypot?address=${contractAddress}`;

        try {
            const response = await fetch(honeypotUrl);
            const data = await response.json();

            if (data && data.honeypotResult) {
                setHoneypotAnalysis(data);
            } else {
                const fallbackAnalysis = {
                    unknownStatus: true,
                    reason:
                        data.simulationError ||
                        "Could not determine the status.",
                };
                setHoneypotAnalysis(fallbackAnalysis);
                console.error("Fallback honeypot analysis:", fallbackAnalysis);
            }
        } catch (error) {
            console.error("Error fetching honeypot data:", error);
            setHoneypotAnalysis(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className=" main-font ">
            <div className="z-50 relative">
                <Sidebar />
            </div>

            <div className="relative row-span-2">
                <div className="relative text-center pt-10 main-font tracking-widest  ">
                    <span className="sm:text-6xl md:text-7xl text-violet-500">
                        LAYERFi
                    </span>
                    <span className="sm:text-6xl md:text-7xl border-b-2 border-cyan-600">
                        PROTOCOL
                    </span>
                    <br />
                    <span>The First Autonomous Protocol on Multi Network</span>
                </div>
            </div>

            <div className="relative mt-10 px-2 w-full ">
                <div className="h-3/4 border-2 div-box rounded-xl mx-auto sm:w-full md:w-3/4 lg:w-1/2 lg:ml-[300px] xl:ml-[310px] 2xl:ml-[480px] py-5 shadow-2xl ">
                    <div className="flex border-b-2 border-violet-300 sm:justify-center md:justify-start pb-3 ">
                        <img className="h-[30px] pl-6" alt="logo" src={logo} />
                        <span className="my-auto mx-2 sub-font">
                            LAYERFI SCANNER
                        </span>
                    </div>

                    <div className="mx-5 my-5 sm:shadow-2xl md:shadow-none">
                        <Box
                            className="md:flex "
                            sx={{
                                alignItems: "flex-end",
                                width: "full",
                            }}>
                            <div className=" md:my-0 sm:flex sm:justify-center sub-font mx-2 ">
                                <select
                                    className="rounded-lg  sm:w-[70px]   md:w-[110px]  mb-4 "
                                    value={network}
                                    onChange={(e) =>
                                        setNetwork(e.target.value)
                                    }>
                                    <option value="BSC">BSC</option>
                                    <option value="Ethereum">ETH</option>
                                </select>
                            </div>
                            <div className="sm:flex w-full ">
                                <TextField
                                    id="contract-address-input"
                                    label="CONTRACT"
                                    variant="outlined"
                                    fullWidth
                                    value={contractAddress}
                                    onChange={handleInputChange}
                                    style={{
                                        backgroundColor: "#D0A2F7",
                                    }}
                                    InputProps={{
                                        className: "sub-font rounded-md",

                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {" "}
                                                <div className="sm:flex sm:justify-center  sm:my-3 md:my-0">
                                                    <Button
                                                        onClick={scanContract}
                                                        variant="contained"
                                                        style={{
                                                            backgroundColor:
                                                                "#00D084",
                                                        }}>
                                                        SCAN
                                                    </Button>
                                                </div>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </Box>
                    </div>
                </div>
            </div>
            {tokenDetails ? (
                <div></div>
            ) : hasInput ? (
                <div className=" text-center text-4xl my-5">
                    <span>⚠️ </span>{" "}
                    <span>PLEASE CHECK THE ADDRESS/NETWORK</span>
                </div>
            ) : (
                <div className=" text-center text-4xl my-5">
                    <p> PLEASE INPUT ADDRESS AND PICK CORRECT NETWORK</p>
                </div>
            )}
            {hasScanned ? (
                <div className="md:grid md:grid-cols-2 sm:grid-cols-1 2xl:mx-[300px]  my-[20px]">
                    <div className="mx-auto ">
                        {isLoading ? (
                            <div className="flex justify-center items-center mt-5">
                                <CircularProgress />
                            </div>
                        ) : (
                            <div>
                                {error && (
                                    <p className="error-message">{error}</p>
                                )}
                                {tokenDetails ? (
                                    <div className="mx-3 mt-[40px] div-box px-5 py-5 rounded-md bg-opacity-40 tracking-widest  shadow-2xl">
                                        {contractAnalysis.map((line, index) => (
                                            <p
                                                key={index}
                                                className={line.className}>
                                                {line.text}
                                            </p>
                                        ))}
                                        <p
                                            className={
                                                tokenDetails.is_mintable === 1
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }>
                                            {tokenDetails.is_mintable === 1
                                                ? "Min Function has Detected on Contract"
                                                : "No Mint Function Detected on Contract"}
                                        </p>
                                        {tokenDetails.is_mintable === 1 ? (
                                            <p className="text-white text-sm tracking-widest">
                                                ❌ This contract includes a mint
                                                function. The presence of a mint
                                                function means that new tokens
                                                can be created, potentially
                                                impacting the token's scarcity
                                                and value. It's important for
                                                token holders to be aware of
                                                this feature as it could affect
                                                the token's economics.
                                            </p>
                                        ) : (
                                            <p className="text-white text-sm tracking-widest">
                                                ✅ This Contract has no mint
                                                function. The absence of a
                                                hidden mint function is
                                                generally positive, as it means
                                                the number of tokens in
                                                circulation cannot be
                                                arbitrarily increased, thus
                                                protecting the token's price
                                                from potential manipulation or
                                                unexpected inflation.
                                            </p>
                                        )}
                                        <p
                                            className={
                                                tokenDetails.can_take_back_ownership ===
                                                1
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }>
                                            {tokenDetails.can_take_back_ownership ===
                                            1
                                                ? "Ownership Reclaim Detected in Contract"
                                                : "No Ownership Reclaim Feature Detected in Contract"}
                                        </p>
                                        {tokenDetails.can_take_back_ownership ===
                                        1 ? (
                                            <p className="text-white text-sm">
                                                ❌ The ability to reclaim
                                                ownership has been detected in
                                                this contract. This is a
                                                potential red flag, as it
                                                implies that even after
                                                renouncing ownership, the
                                                original owners can regain
                                                control. This feature can lead
                                                to centralization and potential
                                                misuse, and thus warrants
                                                caution.
                                            </p>
                                        ) : (
                                            <p className="text-white text-sm">
                                                ✅ No feature to reclaim
                                                ownership is present in this
                                                contract. This is a positive
                                                indication of decentralization,
                                                suggesting that once ownership
                                                is renounced, it cannot be
                                                reclaimed. This contributes to
                                                the contract’s transparency and
                                                trustworthiness.
                                            </p>
                                        )}
                                        <p
                                            className={
                                                tokenDetails.owner_change_balance ===
                                                1
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }>
                                            {tokenDetails.owner_change_balance ===
                                            1
                                                ? "Owner Can Change Balance Detected in Contract"
                                                : "No Owner Change Balance Feature Detected in Contract"}
                                        </p>
                                        {tokenDetails.owner_change_balance ===
                                        1 ? (
                                            <p className="text-white text-sm">
                                                ❌ The contract allows the owner
                                                to change token holder balances.
                                                This is a significant red flag,
                                                as it means the owner has the
                                                power to arbitrarily modify
                                                balances, potentially leading to
                                                asset manipulation, like zeroing
                                                out balances or creating and
                                                selling off tokens. This feature
                                                seriously undermines the
                                                security and trustworthiness of
                                                the contract.
                                            </p>
                                        ) : (
                                            <p className="text-white text-sm">
                                                ✅ The contract does not permit
                                                the owner to change token holder
                                                balances. This is a positive
                                                aspect, enhancing the trust and
                                                security of the contract by
                                                ensuring that token holder
                                                balances remain immutable by the
                                                owner, protecting against
                                                potential manipulation.
                                            </p>
                                        )}
                                        <p
                                            className={
                                                tokenDetails.hidden_owner === 1
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }>
                                            {tokenDetails.hidden_owner === 1
                                                ? "Hidden Owner Detected in Contract"
                                                : "No Hidden Owner Detected in Contract"}
                                        </p>
                                        {tokenDetails.hidden_owner === 1 ? (
                                            <p className="text-white text-sm">
                                                ❌ The contract has hidden
                                                owners. This is a significant
                                                red flag, as hidden ownership
                                                can be an indicator of malicious
                                                intent. It suggests that
                                                developers may retain control
                                                even after seemingly abandoning
                                                ownership, potentially enabling
                                                them to manipulate the contract
                                                or its assets without
                                                transparency.
                                            </p>
                                        ) : (
                                            <p className="text-white text-sm">
                                                ✅ The contract does not have
                                                hidden owners. This is a
                                                positive sign, indicating more
                                                transparency and less risk of
                                                manipulation by undisclosed
                                                parties. The absence of hidden
                                                owners supports the contract’s
                                                integrity and trustworthiness.
                                            </p>
                                        )}
                                        <p
                                            className={
                                                tokenDetails.selfdestruct === 1
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }>
                                            {tokenDetails.selfdestruct === 1
                                                ? "Self-Destruct Capability Detected in Contract"
                                                : "No Self-Destruct Capability Detected in Contract"}
                                        </p>
                                        {tokenDetails.selfdestruct === 1 ? (
                                            <p className="text-white text-sm">
                                                ❌ The contract has a
                                                self-destruct function. This is
                                                a critical red flag, as it means
                                                the contract can be destroyed,
                                                rendering all of its functions
                                                unavailable and potentially
                                                erasing all related assets. The
                                                presence of such a function
                                                suggests a high risk, as it
                                                allows for sudden termination of
                                                the contract's operation and
                                                asset loss.
                                            </p>
                                        ) : (
                                            <p className="text-white text-sm">
                                                ✅ The contract does not have a
                                                self-destruct function. This is
                                                a positive aspect, ensuring the
                                                contract's permanence and the
                                                security of its functions and
                                                related assets. The absence of
                                                such a function reduces the risk
                                                of sudden termination and asset
                                                loss, contributing to the
                                                stability and reliability of the
                                                contract.
                                            </p>
                                        )}
                                        <p
                                            className={
                                                tokenDetails.is_anti_whale ===
                                                "1"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }>
                                            {tokenDetails.is_anti_whale === "1"
                                                ? "Anti-Whale Mechanism Detected in Contract"
                                                : "No Anti-Whale Mechanism Detected in Contract"}
                                        </p>

                                        {tokenDetails.is_anti_whale === "1" ? (
                                            <p className="text-white text-sm">
                                                ✅ The contract includes an
                                                anti-whale mechanism. This means
                                                there are limitations in place
                                                to prevent single addresses from
                                                holding or transacting large
                                                amounts of tokens, which helps
                                                in reducing the risk of market
                                                manipulation by large holders.
                                                Such features promote fairer
                                                distribution and help maintain
                                                market stability.
                                            </p>
                                        ) : (
                                            <p className="text-white text-sm">
                                                ❌ There is no anti-whale
                                                mechanism in this contract. This
                                                implies that there are no
                                                restrictions on the amount of
                                                tokens a single address can hold
                                                or transact. While this allows
                                                for unrestricted trading, it
                                                also means that large holders
                                                (whales) could potentially
                                                influence the market
                                                significantly, which might lead
                                                to volatility or unfair
                                                practices.
                                            </p>
                                        )}
                                        <p
                                            className={
                                                tokenDetails.transfer_pausable ===
                                                "1"
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }>
                                            {tokenDetails.transfer_pausable ===
                                            "1"
                                                ? "Trading Can Be Paused Detected in Contract"
                                                : "Trading Cannot Be Paused Detected in Contract"}
                                        </p>

                                        {tokenDetails.transfer_pausable ===
                                        "1" ? (
                                            <p className="text-white text-sm">
                                                ❌ This contract has the
                                                capability to pause trading.
                                                This means the contract owner
                                                can suspend trading activities
                                                at any time. While this can be
                                                used for security reasons, it
                                                also centralizes control and
                                                could lead to situations where
                                                token holders are unable to sell
                                                their tokens except those with
                                                special permissions. This
                                                feature requires careful
                                                consideration of the contract
                                                owner's intentions and
                                                trustworthiness.
                                            </p>
                                        ) : (
                                            <p className="text-white text-sm">
                                                ✅ Trading cannot be paused in
                                                this contract. This ensures
                                                continuous trading availability
                                                for all token holders, providing
                                                a more predictable and open
                                                trading environment. The absence
                                                of such a pause feature reduces
                                                the risk of centralization and
                                                potential manipulation by the
                                                contract owner.
                                            </p>
                                        )}

                                        <p
                                            className={
                                                verificationStatus ===
                                                "This contract is verified."
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }>
                                            {verificationStatus}
                                        </p>
                                        {verificationStatus ===
                                        "This contract is verified." ? (
                                            <p className="text-sm text-white">
                                                ✅ Great news! The contract's
                                                source code has been verified,
                                                indicating transparency and
                                                reliability. This verification
                                                means the contract's operations
                                                can be trusted and are
                                                accessible for public audit.
                                            </p>
                                        ) : (
                                            <p className="text-sm text-white">
                                                ❌ The contract has not been
                                                verified. This status warrants
                                                caution as the source code has
                                                not been reviewed for
                                                transparency and security by the
                                                community. It's advisable to
                                                conduct thorough due diligence
                                                before interaction.
                                            </p>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>

                    <div className=" ">
                        {" "}
                        {isLoading ? (
                            <div className="flex justify-center items-center mt-5">
                                <CircularProgress />
                            </div>
                        ) : (
                            <div className="grid md:grid-rows-2 sm:grid-rows-1 space-y-5 tracking-widest ">
                                {honeypotAnalysis ? (
                                    <div className="div-box bg-opacity-40 px-5 py-5 sm:mx-3 rounded-md  sm:mt-[20px] md:mt-[40px] shadow-2xl ">
                                        <>
                                            <div>
                                                <span className="text-yellow-500 text-2xl">
                                                    IS THIS HONEYPOT:{" "}
                                                </span>
                                                <br />
                                                {honeypotAnalysis.honeypotResult ? (
                                                    honeypotAnalysis
                                                        .honeypotResult
                                                        .isHoneypot ? (
                                                        <div className="flex space-x-2 text-center ">
                                                            <span className="md:mt-0.5 text-red-600 sm:mt-3 animate-pulse">
                                                                <TbAlertOctagonFilled
                                                                    size={25}
                                                                />
                                                            </span>
                                                            <span className="mt-1 text-justify">
                                                                YES! This token
                                                                is a honeypot,
                                                                Please don't buy
                                                                this token.
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex space-x-2 text-center">
                                                            <span className="md:mt-0.5 sm:mt-3 text-green-500 animate-pulse">
                                                                <TbDiscountCheckFilled
                                                                    size={25}
                                                                />
                                                            </span>
                                                            <span className="mt-1 text-justify">
                                                                NO, you can
                                                                safely buy this
                                                                token, but be
                                                                careful as some
                                                                tokens can be
                                                                changed to
                                                                honeypots.
                                                            </span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <p>
                                                        Unable to determine
                                                        honeypot status.
                                                    </p>
                                                )}
                                            </div>
                                            <div className="">
                                                <p className="text-yellow-500 text-2xl">
                                                    TOKEN BASIC ANALYSIS:
                                                </p>
                                                {honeypotAnalysis.token && (
                                                    <>
                                                        <div>
                                                            <span className="text-yellow-500">
                                                                TOKEN NAME:{" "}
                                                            </span>
                                                            <span>
                                                                {
                                                                    honeypotAnalysis
                                                                        .token
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                        {tokenDetails ? (
                                                            <div className=" flex">
                                                                <span className="text-yellow-500 my-auto">
                                                                    Token
                                                                    Symbol:{" "}
                                                                </span>
                                                                <span>$</span>
                                                                <span className=" ">
                                                                    {
                                                                        tokenDetails.token_symbol
                                                                    }
                                                                </span>
                                                            </div>
                                                        ) : null}
                                                        <div>
                                                            <span className="text-yellow-500 ">
                                                                TOTAL HOLDERS:{" "}
                                                            </span>
                                                            <span>
                                                                {
                                                                    honeypotAnalysis
                                                                        .token
                                                                        .totalHolders
                                                                }
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-yellow-500">
                                                                Max Buy:{" "}
                                                            </span>
                                                            <span>
                                                                {honeypotAnalysis
                                                                    ?.simulationResult
                                                                    ?.maxBuy
                                                                    ?.token
                                                                    ? `${honeypotAnalysis.simulationResult.maxBuy.token} ${honeypotAnalysis.token.symbol}`
                                                                    : "NO BUY LIMIT"}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            {honeypotAnalysis.token ? (
                                                <div className="flex flex-col sm:flex-row">
                                                    <span className=" text-yellow-500 my-auto">
                                                        TOKEN ADDRESS:{" "}
                                                    </span>
                                                    <span
                                                        className=""
                                                        dangerouslySetInnerHTML={{
                                                            __html: formatAddress(
                                                                honeypotAnalysis
                                                                    .token
                                                                    .address
                                                            ),
                                                        }}></span>
                                                </div>
                                            ) : null}
                                            {tokenDetails ? (
                                                <div className=" flex">
                                                    <span className="text-yellow-500 my-auto">
                                                        Owner Address:{" "}
                                                    </span>

                                                    <span
                                                        className=""
                                                        dangerouslySetInnerHTML={{
                                                            __html: formatAddress(
                                                                tokenDetails.owner_address
                                                            ),
                                                        }}></span>
                                                </div>
                                            ) : null}
                                            {tokenDetails ? (
                                                <div className=" flex">
                                                    <span className="text-yellow-500 my-auto">
                                                        Creator Address:{" "}
                                                    </span>

                                                    <span
                                                        className=""
                                                        dangerouslySetInnerHTML={{
                                                            __html: formatAddress(
                                                                tokenDetails.creator_address
                                                            ),
                                                        }}></span>
                                                </div>
                                            ) : null}
                                            {tokenDetails ? (
                                                <p>
                                                    <span className="text-yellow-500">
                                                        {" "}
                                                        Total Supply:{" "}
                                                    </span>

                                                    {tokenDetails.total_supply}
                                                </p>
                                            ) : null}
                                            {honeypotAnalysis.simulationResult && (
                                                <>
                                                    <p
                                                        className={
                                                            honeypotAnalysis
                                                                .simulationResult
                                                                .buyTax > 15
                                                                ? "text-red-500"
                                                                : "text-green-500"
                                                        }>
                                                        Buy Tax:{" "}
                                                        {honeypotAnalysis.simulationResult.buyTax.toFixed(
                                                            2
                                                        )}
                                                        %
                                                    </p>
                                                    <p
                                                        className={
                                                            honeypotAnalysis
                                                                .simulationResult
                                                                .sellTax > 15
                                                                ? "text-red-500"
                                                                : "text-green-500"
                                                        }>
                                                        Sell Tax:{" "}
                                                        {honeypotAnalysis.simulationResult.sellTax.toFixed(
                                                            2
                                                        )}
                                                        %
                                                    </p>
                                                </>
                                            )}
                                        </>

                                        <div></div>
                                    </div>
                                ) : null}
                                {tokenDetails && tokenDetails.holders && (
                                    <div className="div-box bg-opacity-40 px-5 py-5 sm:mx-3 rounded-md  mt-[40px] shadow-2xl ">
                                        <div className="bg-dark-600 text-black p-4 rounded-lg">
                                            <h2 className="text-xl font-bold mb-4 text-yellow-500">
                                                Top 10 Holders
                                            </h2>
                                            <div className="overflow-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-left text-yellow-500">
                                                                Address
                                                            </th>
                                                            <th className="text-left text-yellow-500">
                                                                Balance
                                                            </th>
                                                            <th className="text-left text-yellow-500">
                                                                Percent
                                                            </th>
                                                            <th className="text-left text-yellow-500">
                                                                Type
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {tokenDetails.holders
                                                            .slice(0, 10)
                                                            .map(
                                                                (
                                                                    holder,
                                                                    index
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <td className="truncate">
                                                                            {truncateAddress(
                                                                                holder.address
                                                                            )}
                                                                        </td>
                                                                        <td className="text-left">
                                                                            {formatBalance(
                                                                                holder.balance
                                                                            )}
                                                                        </td>
                                                                        <td className="text-left">{`${formatPercentage(
                                                                            holder.percent
                                                                        )}%`}</td>
                                                                        <td className="text-left">
                                                                            {holder.is_contract ===
                                                                                1 &&
                                                                            holder.is_locked ===
                                                                                1
                                                                                ? "LP"
                                                                                : holder.is_contract ===
                                                                                  1
                                                                                ? "Contract"
                                                                                : "Wallet"}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Scanner;
