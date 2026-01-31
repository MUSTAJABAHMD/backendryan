import express from 'express'
import {contactForm} from '../controllers/userController.js'
const router = express.Router();


router.post('/create',contactForm);


export default router;