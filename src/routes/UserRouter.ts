import { Router } from 'express';
import { getuserByid, getUsers } from '../controllers/UserController';
import { AuthenticateToken } from '../middlware/AuthenticateToken';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', AuthenticateToken, getuserByid);

export default userRouter;
