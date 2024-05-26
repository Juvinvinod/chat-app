import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const statusCheckerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isFlagEnabled = authService.loggedIn();
  return isFlagEnabled || router.createUrlTree(['']);
};
