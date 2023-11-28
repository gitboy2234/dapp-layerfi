import React from "react";
import {
    TextField,
    InputAdornment,
    Button,
    Box,
    MenuItem,
    Select,
} from "@mui/material";
import { IoMdQrScanner } from "react-icons/io"; // Make sure to install react-icons if you haven't

function Textfield({
    contractAddress,
    setContractAddress,
    network,
    setNetwork,
}) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                variant="standard"
                sx={{ marginRight: "8px" }} // Adjust spacing as needed
            >
                <MenuItem value="BSC">BSC</MenuItem>
                <MenuItem value="Ethereum">Ethereum</MenuItem>
            </Select>
            <TextField
                id="contract-address-input"
                label="ENTER CONTRACT ADDRESS"
                variant="outlined"
                fullWidth
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Button variant="contained" color="primary">
                                Check
                            </Button>
                        </InputAdornment>
                    ),
                    startAdornment: (
                        <InputAdornment position="start">
                            <IoMdQrScanner />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
}

export default Textfield;
