import express, {Request, Response} from "express";
import cors from "cors";

import UserRoute from "./routes/userRoutes";
import PersonalRoute from "./routes/personalRoutes";
import GroupRoute from "./routes/groupRoutes";
import RequestRoute from "./routes/requestRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json("Hello World");
});

app.use("/api/v1/user", UserRoute);
app.use("/api/v1/personal", PersonalRoute);
app.use("/api/v1/group", GroupRoute);
app.use("/api/v1/request", RequestRoute);

app.listen(4000, () => {
  console.log("Hello world");
});
