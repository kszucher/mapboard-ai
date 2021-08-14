const express = require("express");
const app = express();
const port = process.env.PORT || 8082;

app.get("/", (req, res) => {
    res.redirect(301, "https://mapboard.io");});

// app.get("/google", (req, res) => {
//     res.redirect(301, "https://mapboard.io");
// });

app.use(function (req, res, next) {
    res.status(404).send("<h1>Sorry nothing found!<h1>");
});

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
