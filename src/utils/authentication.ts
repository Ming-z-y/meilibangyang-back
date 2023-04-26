export type UserPermission = Record<string, string[]>;

type Auth = {
  resource: string | RegExp;
  actions?: string[];
}

export interface AuthParams {

  requiredPermissions?: Array<Auth>;
  
  oneOfPerm?: boolean;
}

const judge = (actions: string[], perm: string[]) => {
  if(!perm || !perm.length) {
    return false;
  }

  if(perm.join('') === '*') {
    return true;
  }

  return actions.every((action) => perm.includes(action));
}



