import app from "./src/app.js";
import "./config.js";

const port = process.env.PORT || 5003;

app.listen(port, () => {
    console.log(`TTS service is running on port ${port}`);
});
