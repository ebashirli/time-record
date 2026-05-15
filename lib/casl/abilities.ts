import {
  AbilityBuilder,
  PureAbility,
  AbilityClass,
  InferSubjects,
} from "@casl/ability";
import { PrismaQuery, Subjects } from "@casl/prisma";
import {
  User,
  Employee,
  Work,
  Company,
  Department,
  Position,
  Checkin,
  Role,
} from "@/prisma/lib/generated/prisma/client";

type AppSubjects =
  | Subjects<{
      User: User;
      Employee: Employee;
      Work: Work;
      Company: Company;
      Department: Department;
      Position: Position;
      Checkin: Checkin;
    }>
  | InferSubjects<"all">;

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;
export const AppAbility = PureAbility as AbilityClass<AppAbility>;

export function defineAbilitiesFor(
  user: (User & { employee?: Employee | null }) | null,
) {
  const { can, cannot, build } = new AbilityBuilder(AppAbility);

  if (!user) {
    // Anonymous users - very limited access
    return build();
  }

  // Assuming you have a role field on User or Employee
  const userRole = user.role || Role.EMPLOYEE;
  const employeeId = user.employee?.id;
  const companyId = user.employee?.companyId;
  const departmentId = user.employee?.departmentId;

  // ADMIN - Full access
  if (userRole === Role.ADMIN) {
    can("manage", "all");
    return build();
  }

  // MANAGER - Department/Company level access
  if (userRole === Role.MANAGER) {
    // Can manage their company
    can("read", "Company", { id: companyId });
    can("update", "Company", { id: companyId });

    // Can manage their department
    can("manage", "Department", { id: departmentId });

    // Can read all employees in their company
    can("read", "Employee", { companyId });

    // Can manage employees in their department
    can(["create", "update", "delete"], "Employee", { departmentId });

    // Can manage positions in their department
    can("manage", "Position", { departmentId });

    // Can view all work and checkins in their department
    can("read", "Work", { employee: { departmentId } });
    can("read", "Checkin", { employee: { departmentId } });

    // Can approve/reject work in their department
    can("update", "Work", { employee: { departmentId } });

    // Can read own user profile
    can("read", "User", { id: user.id });
    can("update", "User", { id: user.id });
  }

  // HR - Employee and company management
  if (userRole === Role.HR) {
    // Can manage all employees in their company
    can("manage", "Employee", { companyId });

    // Can manage departments in their company
    can("manage", "Department", { companyId });

    // Can manage positions in their company
    can("manage", "Position", { company: { id: companyId } });

    // Can read company data
    can("read", "Company", { id: companyId });

    // Can view all work and checkins in their company
    can("read", "Work", { employee: { companyId } });
    can("read", "Checkin", { employee: { companyId } });

    // Can read own user profile
    can("read", "User", { id: user.id });
    can("update", "User", { id: user.id });
  }

  // EMPLOYEE - Basic access (default for all authenticated users)
  if (userRole === Role.EMPLOYEE || !userRole) {
    // Can read own employee record
    can("read", "Employee", { id: employeeId });
    can("update", "Employee", { id: employeeId, fields: ["phone", "avatar"] }); // Limited fields

    // Can read own company and department
    can("read", "Company", { id: companyId });
    can("read", "Department", { id: departmentId });
    can("read", "Position", { id: user.employee?.positionId });

    // Can manage own work records
    can("create", "Work", { employeeId });
    can("read", "Work", { employeeId });
    can("update", "Work", { employeeId, status: "draft" }); // Can only edit drafts
    cannot("delete", "Work"); // Cannot delete work records

    // Can manage own checkins
    can("create", "Checkin", { employeeId });
    can("read", "Checkin", { employeeId });

    // Can read own user profile
    can("read", "User", { id: user.id });
    can("update", "User", { id: user.id });
  }

  return build();
}

// Helper to create abilities from session
export function createAbilityFromSession(
  user: (User & { employee?: Employee | null }) | null,
) {
  return defineAbilitiesFor(user);
}
