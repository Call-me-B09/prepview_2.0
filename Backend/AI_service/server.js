import app from "./src/app.js";

import "./config.js"






app.listen(process.env.PORT, () => {
    console.log(`AI service is running on port ${process.env.PORT}`);
});