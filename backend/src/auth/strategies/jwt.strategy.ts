import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy {
  // Passport JWT strategy placeholder
  validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
