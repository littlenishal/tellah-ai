import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../types';
export declare const authenticateToken: (req: ExtendedRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.middleware.d.ts.map