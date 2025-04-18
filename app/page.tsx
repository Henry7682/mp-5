import Urls from "./components/urls";
import { Container, Typography } from "@mui/material";

export default function Home() {
    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                URL Shortener
            </Typography>
            <Urls />
        </Container>
    );
}
