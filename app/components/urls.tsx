"use client";
import { useState, FormEvent } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    Paper,
} from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckIcon from "@mui/icons-material/Check";

export default function Urls() {
    const [url, setUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [short, setShort] = useState("");
    const [error, setError] = useState("");
    const [copy, setCopy] = useState(false);

    const copyHandler = () => {
        navigator.clipboard.writeText(short);
        setCopy(true);
    };

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        setError("");
        setShort("");

        if (typeof window !== "undefined" && url.startsWith(window.location.origin)) {
            setError("Invalid URL: Cycled URL is not allowed");
            return;
        }

        try {
            const res = await fetch("/api/urlData", {
                method: "POST",
                body: JSON.stringify({ url, alias }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                return;
            }

            setShort(`${window.location.origin}/${alias}`);
        } catch (err) {
            setError("An unknown error occurred");
        }
    }

    return (
        <Box component="form" onSubmit={onSubmit} mt={2}>
            <TextField
                label="Long URL"
                placeholder="https://example.com"
                fullWidth
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                margin="normal"
            />
            <TextField
                label="Custom Alias"
                placeholder="your-alias"
                fullWidth
                required
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                margin="normal"
            />
            {error && (
                <Typography color="error" variant="body2" mt={1}>
                    {error}
                </Typography>
            )}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
            >
                Shorten
            </Button>

            {short && (
                <Paper
                    elevation={2}
                    sx={{ mt: 3, p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                    <Typography variant="body1" color="primary">
                        <a href={short} target="_blank" rel="noopener noreferrer">{short}</a>
                    </Typography>
                    <IconButton onClick={copyHandler} color="primary">
                        {copy ? <CheckIcon /> : <ContentCopyRoundedIcon />}
                    </IconButton>
                </Paper>
            )}
        </Box>
    );
}
