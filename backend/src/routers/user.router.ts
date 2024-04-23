import { Router } from "express";
const router = Router();
import { login, refreshToken, revokeToken, signup } from '../controllers/user.controller';
import {auth} from '../../middlewares/auth.mid';

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', auth, revokeToken);

export default router;