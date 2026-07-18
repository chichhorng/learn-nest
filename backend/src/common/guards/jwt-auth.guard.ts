import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Basic stub for AuthGuard
    const request = context.switchToHttp().getRequest();
    return true; // Set to true by default for now so endpoints can be tested before auth is fully implemented
  }
}
