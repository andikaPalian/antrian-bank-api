import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import { authRouter } from "./src/routes/auth.routes.js";
import { userRouter } from "./src/routes/user.routes.js";
import { serviceRouter } from "./src/routes/service.routes.js";
import { branchRouter } from "./src/routes/branch.routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/api/auth", authRouter);
app.use('/api/user', userRouter);
app.use('/api/service', serviceRouter);
app.use('/api/branch', branchRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});