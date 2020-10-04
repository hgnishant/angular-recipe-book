import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,private route:Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean|UrlTree>   {
    return this.authService.user.pipe(take(1),
      map((user) => {
        const isAuth= !!user;
        if(isAuth)return true;
//use take(1), as we dont care for teh values unless the guard runs again
        return this.route.createUrlTree(['/auth']);
      })
    );
  }
}
