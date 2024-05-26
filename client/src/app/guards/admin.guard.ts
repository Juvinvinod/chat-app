import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);
  const isFlagEnabled = authService.adminLoggedIn();
  return isFlagEnabled || router.createUrlTree(['login']);
};
