import jwt from "jsonwebtoken"

export function isAuthenticated(req, res, next) {
    if (req.cookies.access) {
        const user = jwt.verify(req.cookies.access, process.env.SECRET)
        if (user) next()
    }
    return res.status(403).json("not authorized")
}