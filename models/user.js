import Dbl from "db-local"
import crypto from "node:crypto"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const { Schema } = new Dbl({ "path": "./database" })
const User = Schema("User", {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
})


export class userModel {
    static getusers() {
        const users = User.find()
        return users
    }

    static async create({ username, password }) {
        const result = User.findOne({ username })
        if (result) throw new Error("user already exist")
        const _id = crypto.randomUUID()
        const hashedPassword = await bcrypt.hash(password, 10)
        User.create({
            _id,
            username,
            password: hashedPassword
        })
            .save()
        return _id
    }

    static async login({ username, password }) {

        const user = User.findOne({ username })

        if (!user) throw new Error("error username credential")
        const compare = await bcrypt.compare(password, user.password)
        if (compare) {
            const token = jwt.sign({
                _id: user.id,
                username: user.username
            }, process.env.SECRET)
            console.log("user in model login", user)
            return { token, _id: user._id, username: user.username }
        }
        throw new Error("password error")
    }


    static delete({ id }) {
        const user = User.findOne({ _id: id })
        if (!user) throw new Error("user not existing")
        user.remove()
        return id
    }
}
