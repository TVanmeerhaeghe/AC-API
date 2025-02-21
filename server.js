const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Bonjour, monde !");
});

app.listen(port, () => {
    console.log(`Le serveur écoute sur http://localhost:${port}`);
});
