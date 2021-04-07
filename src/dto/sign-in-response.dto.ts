import { User } from '../users/interfaces/user.interface';

export interface SignInResponseDto {
  user: User,
  token: string;
}
