import { Router } from 'express';
import { getuserByid, getUsers } from '../controllers/UserController';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getuserByid);

export default userRouter;
