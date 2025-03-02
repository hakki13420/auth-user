import express from "express"
import cookieParser from "cookie-parser"
import "dotenv/config"
import userRoutes from "./routes/user.js"
import { isAuthenticated } from "./middlwares/isAuth.js"
import { UserController } from "./controllers/user.js"
import path from "node:path"

const PORT = process.env.PORT || 5555


const app = express()
app.use(cookieParser())
app.use(express.static(path.join(process.cwd(), "public")))
app.set("view engine", "ejs")
app.use(express.json())


app.get("/", (req, res) => res.render("pages/home.ejs", { user: null }))
app.get("/login", (req, res) => res.render("pages/login", { user: null }))
app.post("/login", (req, res) => UserController.login(req, res))
app.post("/register", (req, res) => UserController.createUser(req, res))
app.get("/register", (req, res) => res.render("pages/register.ejs", { user: null }))
app.use("/users", isAuthenticated, userRoutes)


app.listen(PORT, () => console.log(`the server is running on http://localhost:${PORT}`))