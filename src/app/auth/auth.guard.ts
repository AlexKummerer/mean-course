import { inject } from '@angular/core';
import { Router, type ActivatedRouteSnapshot, type CanActivateFn, type RouterStateSnapshot, type UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state : RouterStateSnapshot) :  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  
  const router = inject(Router);
 const authService = inject(AuthService);
 const isAuth = authService.getIsAuth();
  if(!isAuth){
    router.navigate(['/login']);
  }
  return true;
};
