import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { EmployeeRepository } from 'src/modules/employee/repo/employee.repo';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private employeeService: EmployeeRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();  
    const employeeFromDB = await this.employeeService.findByEmail(user.usernane);
    const employeeRoles = employeeFromDB.employee_role.split(',');
    return requiredRoles.some((role) => employeeRoles.includes(role));
  }
}
