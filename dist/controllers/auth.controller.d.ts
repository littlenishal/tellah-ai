import { Request, Response } from 'express';
import { ExtendedUser } from '../types/index';
export declare const authController: {
    signUp(req: Request & {
        user?: ExtendedUser;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    signIn(req: Request & {
        user?: ExtendedUser;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    signOut(req: Request & {
        user?: ExtendedUser;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCurrentUser(req: Request & {
        user?: ExtendedUser;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=auth.controller.d.ts.map