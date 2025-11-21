import express from 'express'
import { fetchAllUsers , fetchUser ,softDelete , block , unblock} from '../controllers/AdminController/AdminController.js'

const router = express.Router()

router.get('/users',fetchAllUsers)

router.get('/users/:id',fetchUser)

router.patch('/users/delete/:id',softDelete)

router.patch('/users/block/:id',block)

router.patch('/users/unblock/:id',unblock)



export default router