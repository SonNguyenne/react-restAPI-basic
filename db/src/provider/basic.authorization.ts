import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
} from '@loopback/authorization';
import _ from 'lodash';

export async function basicAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  const userRoles = authorizationCtx.principals[0].roles;
  const allowedRoles = metadata.allowedRoles;

  let decision = AuthorizationDecision.ABSTAIN;

  for (const role of userRoles) {
    if (allowedRoles?.includes(role)) {
      decision = AuthorizationDecision.ALLOW;
      break;
    }
  }

  return decision;
}
