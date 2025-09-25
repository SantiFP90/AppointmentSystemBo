import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthLoginService } from './auth-login.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthLoginService);
  const credentials = auth.getCredentials();

  let headers = req.headers.set('Accept', 'application/json');
  if (credentials) {
    headers = headers.set('Authorization', `Bearer ${credentials}`);
  }

  const cloned = req.clone({ headers });
  return next(cloned);
};

//Forma antigua con clase:
// import {
//   HttpEvent,
//   HttpHandler,
//   HttpHeaders,
//   HttpInterceptor,
//   HttpRequest,
// } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { AuthLoginService } from './auth-login.service';

// @Injectable({ providedIn: 'root' })
// export class InterceptorService implements HttpInterceptor {
//   constructor(private auth: AuthLoginService) {}

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     const credentials = this.auth.getCredentials();
//     let headers = req.headers ?? new HttpHeaders();

//     if (credentials) {
//       headers = headers.set('Authorization', `Bearer ${credentials}`);
//     }

//     const cloned = req.clone({ headers });
//     return next.handle(cloned);
//   }
// }
