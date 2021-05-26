import express from "express";
import { login, signup, isAuthorize } from '../Controller/users-controller'

const router = express.Router();

//Route for getting all the users
router.post('/users-signup',signup )
router.post("/users-login", login);

export default router
