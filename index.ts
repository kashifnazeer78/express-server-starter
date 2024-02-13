import dotenv from "dotenv"

dotenv.config()

import express, {Application, Request, Response} from "express"
import cors from "cors"
import morgan from "morgan"
import passport from "passport";

import {db} from "./config/database";

import categoryRoute from "./routes/category.route";
import memberRoute from "./routes/member.route";


const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
require("./config/passport");

app.use("/category", categoryRoute);
app.use("/member", memberRoute)

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome! To the QCP Server');
});

process.on("SIGINT", async () => {
    try {
        await db.$disconnect();
        console.log("Disconnected from database.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}!`));