// import { Injectable } from '@nestjs/common';
// //import { UsersService } from 'path-to-your-users-service'; 
// import { compare } from 'bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(private readonly usersService: UsersService) {}

//   async validateUser(username: string, password: string): Promise<any> {
//     const user = await this.usersService.findOne(username);

//     if (user && (await compare(password, user.password))) {
//       // Passwords match
//       const { password, ...result } = user;
//       return result;
//     }
//     return null;
//   }
// }
