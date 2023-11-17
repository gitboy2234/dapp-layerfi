import React, { useState } from "react";
import Web3 from "web3";
import "./scanner.css";
import BigInt from "bignumber.js";
import logo from "../../assets/Images/logo2.png";
import TextField from "@mui/material/TextField";
import { IoMdQrScanner } from "react-icons/io";
import Sidebar from "../../components/Sidebar/sidebar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { TbDiscountCheckFilled, TbAlertOctagonFilled } from "react-icons/tb";
import CircularProgress from "@mui/material/CircularProgress";
import { FaCopy } from "react-icons/fa6";
import Alert from "@mui/material/Alert";
import { FaCheck } from "react-icons/fa6";
function Scanner() {
    const [contractAddress, setContractAddress] = useState("");
    const [verificationStatus, setVerificationStatus] = useState("");
    const [contractAnalysis, setContractAnalysis] = useState([]);
    const [honeypotAnalysis, setHoneypotAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const web3 = new Web3(
        Web3.givenProvider ||
            "https://skilled-aged-replica.bsc.quiknode.pro/fa781ac0e208b4f43499a55709c6af36b7784544/"
    );

    const scanContract = async () => {
        setIsLoading(true);
        if (!contractAddress) {
            alert("Please enter a contract address.");
            setIsLoading(false);
            return;
        }

        const apiKey = "JUDPV627WC6YPRF9PJ992PQ4MMAIZVCDVV";
        const abiUrl = `https://api.bscscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
        const txUrl = `https://api.bscscan.com/api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
        const sourceUrl = `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`;

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
            if (sourceData.status === "1" && sourceData.result.length > 0) {
                const sourceCode = sourceData.result[0].SourceCode;

                const creatorBalance = BigInt(
                    await contract.methods.balanceOf(creatorAddress).call()
                );
                const totalSupply = BigInt(
                    await contract.methods.totalSupply().call()
                );
                const creatorPercentage =
                    (creatorBalance * BigInt(100)) / totalSupply;

                let analysisLines = [];
                analysisLines.push({
                    text: "Contract Analysis Report:",
                    className: "text-2xl text-violet-800",
                });
                analysisLines.push({
                    text: sourceCode.includes("transferOwnership")
                        ? "Contract has transfer Ownership function."
                        : "No transfer Ownership function found.",
                    className: "",
                });
                analysisLines.push({
                    text:
                        sourceCode.includes("setBuyTax") ||
                        sourceCode.includes("setSellTax")
                            ? "Contract has Tax fee modifier functions."
                            : "No fee modifier functions found.",
                    className: "",
                });
                analysisLines.push({
                    text: `Creator holds ${creatorPercentage.toString()}% of tokens.`,
                    className:
                        creatorPercentage > 5
                            ? "text-red-500"
                            : "text-green-500",
                });

                setContractAnalysis(analysisLines);
            } else {
                setContractAnalysis([
                    "Unable to fetch or analyze contract source code.",
                ]);
            }
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

    const checkHoneypot = async () => {
        setIsLoading(true);
        const honeypotUrl = `https://api.honeypot.is/v2/IsHoneypot?address=${contractAddress}`;

        try {
            const response = await fetch(honeypotUrl);
            const data = await response.json();

            if (data && data.honeypotResult) {
                setHoneypotAnalysis(data);
            } else {
                setHoneypotAnalysis(null);
                console.error("Invalid response format from honeypot API.");
            }
        } catch (error) {
            console.error("Error fetching honeypot data:", error);
            setHoneypotAnalysis(null);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        try {
            let summaryText = "";

            // Adding the LayerFi Protocol text at the top
            summaryText += "**BROUGHT TO YOU BY LAYERFI PROTOCOL**\n\n";

            contractAnalysis.forEach((line) => {
                if (line.text.includes("Creator holds")) {
                    const percentageEmoji = line.text.includes("text-red-500")
                        ? "❌"
                        : "✅";
                    summaryText += `**${line.text}** ${percentageEmoji}\n`;
                } else {
                    summaryText += `**${line.text}**\n`;
                }
            });

            if (honeypotAnalysis && honeypotAnalysis.honeypotResult) {
                const honeypotEmoji = honeypotAnalysis.honeypotResult.isHoneypot
                    ? "❌"
                    : "✅";
                summaryText += `**IS THIS HONEYPOT**: ${
                    honeypotAnalysis.honeypotResult.isHoneypot
                        ? "YES! This token is a honeypot, Please don't buy this token."
                        : "NO, you can safely buy this token, but be careful as some tokens can be changed to honeypots."
                } ${honeypotEmoji}\n`;
            }

            if (honeypotAnalysis && honeypotAnalysis.token) {
                summaryText += `**TOKEN NAME**: ${honeypotAnalysis.token.name} 💲\n`;
                summaryText += `**ADDRESS**: ${honeypotAnalysis.token.address}\n`;

                const holdersEmoji =
                    honeypotAnalysis.token.totalHolders > 10 ? "✅" : "❌";
                summaryText += `**TOTAL HOLDERS**: ${honeypotAnalysis.token.totalHolders} ${holdersEmoji}\n`;
            }

            if (honeypotAnalysis && honeypotAnalysis.simulationResult) {
                const buyTaxEmoji =
                    honeypotAnalysis.simulationResult.buyTax <= 15
                        ? "✅"
                        : "❌";
                const sellTaxEmoji =
                    honeypotAnalysis.simulationResult.sellTax <= 15
                        ? "✅"
                        : "❌";
                summaryText += `**Buy Tax**: ${honeypotAnalysis.simulationResult.buyTax.toFixed(
                    2
                )}% ${buyTaxEmoji}\n`;
                summaryText += `**Sell Tax**: ${honeypotAnalysis.simulationResult.sellTax.toFixed(
                    2
                )}% ${sellTaxEmoji}\n`;
            }

            navigator.clipboard
                .writeText(summaryText)
                .then(() => {
                    console.log("Summary copied to clipboard");
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000); // Hide message after 2 seconds
                })
                .catch((err) => {
                    console.error("Failed to copy: ", err);
                });
        } catch (error) {
            console.error("Error while copying to clipboard: ", error);
        }
    };

    return (
        <div className=" main-font ">
            <div className="z-50 relative">
                <Sidebar />
            </div>

            <div className="relative row-span-2">
                <div className="relative text-center pt-10 main-font tracking-widest sm:ml-[40px] lg:ml-[650px]">
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
            {copySuccess && (
                <Alert
                    icon={<FaCheck />}
                    severity="success"
                    className="absolute z-50 md:bottom-36 md:left-14 sm:left-32  ">
                    Copied to clipboard!
                </Alert>
            )}
            <div className="relative mt-10 px-2 w-full">
                <div className="h-3/4 border-2 bg-white rounded-xl mx-auto sm:w-full md:w-1/2 lg:ml-[300px] xl:ml-[500px] py-5 ">
                    <div className="flex border-b-2 border-violet-300 ">
                        <img className="h-[30px] pl-6" alt="logo" src={logo} />
                        <span className="my-auto mx-2 sub-font">
                            LAYERFI SCANNER
                        </span>
                    </div>

                    <div className="mx-5">
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
                                id="contract-address-input"
                                label="Enter Contract Address"
                                variant="standard"
                                fullWidth
                                value={contractAddress}
                                onChange={(e) =>
                                    setContractAddress(e.target.value)
                                }
                            />
                            <div className="mx-2">
                                <Button
                                    onClick={scanContract}
                                    variant="contained"
                                    style={{ backgroundColor: "#00D084" }}>
                                    SCAN
                                </Button>
                            </div>
                        </Box>
                        {isLoading ? (
                            <div className="flex justify-center items-center mt-5">
                                <CircularProgress />
                            </div>
                        ) : (
                            <div className="my-4 px-5 tracking-wider">
                                <div className="relative">
                                    <div
                                        className="justify-end flex hover:cursor-pointer text-violet-600"
                                        onClick={copyToClipboard}>
                                        <FaCopy size={25} />
                                    </div>
                                </div>

                                <div className="">
                                    <div>
                                        {honeypotAnalysis && (
                                            <p>
                                                <span className=" text-violet-800 text-2xl">
                                                    IS THIS HONEYPOT:{" "}
                                                </span>
                                                <br />
                                                {honeypotAnalysis.honeypotResult
                                                    .isHoneypot ? (
                                                    <>
                                                        <div className="flex space-x-2 text-center ">
                                                            <span className="md:mt-0.5 text-red-600 sm:mt-3  animate-pulse">
                                                                <TbAlertOctagonFilled
                                                                    size={25}
                                                                />
                                                            </span>
                                                            <span className="mt-1 ">
                                                                YES! This token
                                                                is a honeypot,
                                                                Please don't buy
                                                                this token.
                                                            </span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex space-x-2 text-center">
                                                            <span className="md:mt-0.5 sm:mt-3 text-green-500 animate-pulse">
                                                                <TbDiscountCheckFilled
                                                                    size={25}
                                                                />
                                                            </span>
                                                            <span className="mt-1">
                                                                NO, you can
                                                                safely buy this
                                                                token, but be
                                                                careful as some
                                                                tokens can be
                                                                changed to
                                                                honeypots.
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="">
                                        {honeypotAnalysis && (
                                            <div>
                                                <p className=" text-violet-800 text-2xl">
                                                    TOKEN BASIC ANALYSIS:
                                                </p>
                                                <div className="">
                                                    <span className=" text-green-500">
                                                        TOKEN NAME:
                                                    </span>{" "}
                                                    <span className="">
                                                        {" "}
                                                        {
                                                            honeypotAnalysis
                                                                .token.name
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            {honeypotAnalysis && (
                                                <div className="flex">
                                                    <span className=" text-green-500">
                                                        ADDRESS:
                                                    </span>
                                                    <span>
                                                        {
                                                            honeypotAnalysis
                                                                .token.address
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {honeypotAnalysis && (
                                            <div>
                                                <span className=" text-green-500">
                                                    TOTAL HOLDERS:{" "}
                                                </span>
                                                <span>
                                                    {
                                                        honeypotAnalysis.token
                                                            .totalHolders
                                                    }
                                                </span>
                                            </div>
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

                                        {honeypotAnalysis && (
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
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        {contractAnalysis.map((line, index) => (
                                            <p
                                                key={index}
                                                className={line.className}>
                                                {line.text}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Scanner;
