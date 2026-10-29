
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || "1.2.0";

app.get("/", (req, res) => {
    res.json({
        application: "AutoHeal CI/CD Platform",
        version: VERSION,
        status: "running"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        version: VERSION,
        timestamp: new Date().toISOString()
    });
});

if (require.main === module) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`AutoHeal v${VERSION} running on port ${PORT}`);
    });
}

module.exports = app;
