require("dotenv").config({ path: "./.env" });

const PORT = process.env.PORT || 3001;
const MONGOOSE_URI = process.env.MONGOOSE_URI;
("mongodb://dbadmin:0626814488BAnk@10.10.0.220:27020/?authMechanism=DEFAULT&authSource=admin");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const express = require("express");
const app = express();

app.use(bodyParser.json());
app.use(cors());

const { kittySchema } = require("./schemas/kitten");

const Kitten = mongoose.model("Kitten", kittySchema);

app.get("/", async (req, res) => {
    const kittens = await Kitten.find();
    res.json({
        kittens,
    });
});

app.post("/", async (req, res) => {
    console.log(req.body);
    if (!req.body?.name) {
        res.status(400).json({
            msg: "name required",
        });
        return;
    }
    const kitten = new Kitten({ name: req.body.name });
    await kitten.save();

    res.json({
        kitten,
    });
});

app.post("/delete", async (req, res) => {
    console.log(req.body);
    if (!req.body?._id) {
        res.status(400).json({
            msg: "_id required",
        });
        return;
    }

    await Kitten.findByIdAndDelete(req.body._id);
    res.send("deleted");
});

const main = async () => {
    await mongoose.connect(MONGOOSE_URI);
    app.listen(PORT, () => {
        console.log("start... at port ");
    });
};

main();
