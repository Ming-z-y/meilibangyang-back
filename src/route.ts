import { IconProps } from "@arco-design/web-react/icon";
import { useEffect, useMemo, useState } from "react";
import {
  IconHome,
  IconUserGroup,
  IconCopy,
  IconIdcard,
} from '@arco-design/web-react/icon';

export type IRoute = {
  name: string;
  key: string;
  breadcrumb?: boolean;
  children?: IRoute[];
  hideInMenu?: boolean;
  icon?: React.ForwardRefExoticComponent<IconProps& React.RefAttributes<unknown>>
}

export const routes: IRoute[] = [
  {
    name: 'menu.work',
    key: 'work',
    icon: IconHome
  },
  {
    name: 'menu.account',
    key: 'account',
    icon: IconIdcard
  },
  {
    name: 'menu.category',
    key: 'category',
    icon: IconCopy
  }
]

export const getName = (path: string, routes: IRoute[]) => {
    return routes.find((item) => {
      const itemPath = `/${item.key}`;      
      if(path === itemPath) {
        return item.name;
      } else if(item.children) {
        return getName(path, item.children);
      }
  })
}

export const generatePermission = () => {

}

const useRoute = (userPermission): [IRoute[], string] => {
  const filterRoute = (routes: IRoute[], arr = []): IRoute[] => {
    if(!routes.length) {
      return [];
    }

    for(const route of routes) {
      const {} = route;
    }
  }

  const [permissionRoute, setPermissionRoute] = useState(routes);
  
  useEffect(() => {
    // const newRoutes = filterRoute(routes);
    // setPermissionRoute(newRoutes);
  }, [userPermission]);

  const defaultRoute = useMemo(() => {
    const first = permissionRoute[0];
    if(first) {
      const firstRoute = first?.children?.[0]?.key || first.key
      return firstRoute
    }
  }, [permissionRoute]);

  return [permissionRoute, defaultRoute];
}

export default useRoute;