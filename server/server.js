require("dotenv").config();
const app = require("./app");

function normalizaPort(val) {
    const port = parseInt(val, 10);
    if (Number.isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

const port = normalizaPort(process.env.PORT || "3001");

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});