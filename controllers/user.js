import { userModel } from "../models/user.js";
import fs from "node:fs"
import path from "node:path"
import jwt from "jsonwebtoken"


export class UserController {

    static getAllUsers(req, res) {
        //return res.sendFile(path.join(process.cwd(), "./views/index.html"))
        let logedUser = null
        if (req.cookies.access) {
            logedUser = jwt.verify(req.cookies.access, process.env.SECRET)
        }
        const users = userModel.getusers()
        console.log("userloged ", logedUser)
        return res.render("index", { users, user: logedUser })
        //return res.status(200).json(users)
    }

    static async createUser(req, res) {
        //validation body
        const { username, password } = req.body
        console.log("user create", username, password)
        try {
            const result = await userModel.create({ username, password })
            return res.render("index", { users })

        } catch (error) {
            return res.status(400).json(error.message)
        }

    }

    static async login(req, res) {
        const { username, password } = req.body
        try {
            const { token, ...user } = await userModel.login({ username, password })
            const users = userModel.getusers()
            res.cookie("access", token, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 1000
            })
            return res.render("index", { users, user })

        } catch (error) {
            return res.status(400).json(error.message)
        }
    }


    static logout(req, res) {

        res.clearCookie("access")
        res.redirect("/")
    }

    static deleteUser(req, res) {
        const { id } = req.params
        console.log("id  ", id)
        try {
            userModel.delete({ id })
            return res.status(200).json(id)
        } catch (error) {
            return res.status(404).json(error.message)
        }
    }

}