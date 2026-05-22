import { Request, Response, NextFunction } from 'express';
import { AppError } from '@collab/shared';
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=errorHandler.d.ts.map