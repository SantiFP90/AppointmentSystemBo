import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthLoginService } from '../service/auth-login.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthLoginService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/welcome']);
    return false;
  }
  return true;
};
