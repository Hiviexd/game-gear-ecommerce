import express, { ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import session from "express-session";
import MongoStoreSession from "connect-mongo";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import itemRoutes from "./routes/item.routes";
import orderRoutes from "./routes/order.routes";
import path from "path";

dotenv.config();

// Enable CORS for Angular frontend
const app = express();
app.use(
    cors({
        origin: "http://localhost:4200",
        credentials: true,
    })
);

// Return the "new" updated object by default when doing findByIdAndUpdate
mongoose.plugin((schema) => {
    schema.pre("findOneAndUpdate", function (this: any) {
        if (!("new" in this.options)) {
            this.setOptions({ new: true });
        }
    });
});

const MongoStore = MongoStoreSession(session);

app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());

// database
if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});
const database = mongoose.connection;

database.on("error", (error) => {
    console.log("MongoDB connection error:", error);
});

database.once("open", () => {
    console.log("MongoDB connection successful");
});

app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: "lax",
        },
    })
);

// API routes
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/orders", orderRoutes);

// serve production frontend
if (process.env.NODE_ENV === "production") {
  const angularDistPath = path.join(__dirname, "../game-gear-ecommerce/browser");

    app.use(express.static(angularDistPath));

    app.get(/^\/(?!api\/).*/, (req, res) => {
        res.sendFile(path.join(angularDistPath, "index.html"));
    });
}

// catch 404
app.use((req, res) => {
    // Check if it's an API request
    if (req.path.startsWith("/api/")) {
        res.status(404).json({ error: "API endpoint not found" });
    } else {
        res.status(404).json({ error: "Not Found" });
    }
});

// error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    let customErrorMessage = "";
    if (err.name == "DocumentNotFoundError") customErrorMessage = "Error: Object not found";

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.json({ error: customErrorMessage || err.message || "Something went wrong!" });

    console.log(err);
});

app.listen(process.env.PORT || 3009, () => {
    console.log(`Server is running on port ${process.env.PORT || 3009}`);
});

export default app;
