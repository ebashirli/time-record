import { ForbiddenError, subject } from "@casl/ability";
import { AppAbility } from "./abilities";

// Check if user can perform action on subject
export function assertCan(
  ability: AppAbility,
  action: string,
  subjectType: any,
  subjectData?: any,
) {
  const sub = subjectData
    ? subject(subjectType.name, subjectData)
    : subjectType;

  if (!ability.can(action, sub)) {
    throw new ForbiddenError(
      `You are not allowed to ${action} ${subjectType.name}`,
    );
  }
}

// For use in API routes
export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function authorize(
  ability: AppAbility,
  action: string,
  subjectType: any,
  subjectData?: any,
) {
  try {
    assertCan(ability, action, subjectType, subjectData);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      throw new AuthorizationError(error.message);
    }
    throw error;
  }
}
