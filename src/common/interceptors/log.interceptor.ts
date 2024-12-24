import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';

export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // get star time from the request
    const startTime = Date.now();

    // get information about the request
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const body = request.body;
    const clientIp = request.ip;

    return next.handle().pipe(
      tap(() => {
        // get elapsed time
        const finalTime = Date.now();
        const elapsedTime = finalTime - startTime;

        // log information
        const logString =
          `[${new Date(startTime).toISOString()}] ${method} ${url}
          Processing-Time: ${elapsedTime}ms
          Client-IP: ${clientIp}
          Body: ${JSON.stringify(body)}
          `.replace(/  /g, '');
        console.log(logString);
      }),
      catchError((error) => {
        // get elapsed time
        const finalTime = Date.now();
        const elapsedTime = finalTime - startTime;

        // get error information
        const errorMessage = error.message || 'Unknown error';
        const errorStack = error.stack || 'No stack trace available';
        const errorType = error.constructor.name;

        // log information
        const logString =
          `[${new Date(startTime).toISOString()}] ${method} ${url}
          Processing-Time: ${elapsedTime}ms
          Client-IP: ${clientIp}
          Body: ${JSON.stringify(body)}
          =====================
          AN ERROR HAS OCCURED!
          =====================
          Error-Type: ${errorType}
          Error-Message: ${errorMessage}
          Stack-Trace: ${errorStack}
          `.replace(/  /g, '');
        console.log(logString);

        throw error;
      }),
    );
  }
}
