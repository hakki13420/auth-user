import { Router } from 'express'
import { UserController } from "../controllers/user.js"

const router = Router()

router.get('/', (req, res) => UserController.getAllUsers(req, res))
router.post('/register', (req, res) => UserController.createUser(req, res))
//router.post('/login', (req, res) => UserController.login(req, res))
router.post('/logout', (req, res) => UserController.logout(req, res))
router.delete('/:id', (req, res) => UserController.deleteUser(req, res))

export default router
