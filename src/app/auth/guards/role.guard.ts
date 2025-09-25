import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthLoginService } from '../service/auth-login.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthLoginService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data['roles'] || [];
  const user = auth.getUserRole();

  if (!user || !expectedRoles.includes(user)) {
    router.navigate(['/welcome']);
    return false;
  }

  return true;
};
