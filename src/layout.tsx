import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Menu,
  Breadcrumb,
  Spin,
  Layout,
  Message,
} from "@arco-design/web-react";
import Navbar from "./components/NavBar";
import cs from "classnames";
import qs from "query-string";
import styles from "./style/layout.module.less";
import {
  Link,
  useLocation,
  useNavigate,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import useLocale from "./utils/useLocale";
import { useRecoilState } from "recoil";
import { globalState } from "./store/atom";
import { IconMenuFold, IconMenuUnfold } from "@arco-design/web-react/icon";
import Footer from "./components/Footer";
import { Account, Category, Work } from "@/pages";
import useRoute, { IRoute, routes } from "./route";
import NOTFOUND403 from "./components/NOTFOUND403";

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const Sider = Layout.Sider;
const Content = Layout.Content;

function getIcon(route: IRoute): JSX.Element {
  if (route.icon) {
    return <route.icon className={styles.icon} />;
  }
  return <div className={styles["icon-empty"]} />;
}

function getFlattenRoutes(routes: IRoute[]) {
  const mod = import.meta.glob("./pages/**/[a-z[]*.tsx");
  const res = [];

  function travel(_routes: any[]) {
    _routes.forEach((route) => {
      const visibleChildren = (route.children || []).filter(
        (child) => !child.hideInMenu
      );
      if (route.key && (!route.children || !visibleChildren.length)) {
        try {
          if (route.key.includes("/:")) {
            route.component =
              mod[`./pages/${route.key.spilt("/:")[0]}/index.tsx`];
          } else {
            route.component = mod[`./pages/${route.key}/index.tsx`];
          }
          res.push(route);
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
  travel(routes);

  return res;
}

const PageLayout = () => {
  const history = useLocation();
  const navigate = useNavigate();
  const pathname = history.pathname;
  const currentComponent = qs.parseUrl(pathname).url.slice(1);

  const locale = useLocale();
  const global = useRecoilState(globalState);
  const settings = global[0]?.settings;
  const userInfo = global[0]?.userInfo;
  const userLoading = global[0]?.userLoading;
  const [route, defaultRoute] = useRoute(userInfo?.permissions);

  const defaultSelectedKeys = [currentComponent || defaultRoute];
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys);

  const menuWidth = collapsed ? 48 : 220;

  const flattenRoutes = useMemo(() => getFlattenRoutes(routes) || [], [routes]);

  const paddingLeft = collapsed ? { paddingLeft: 48 } : { paddingLeft: 220 };

  const [breadcrumb, setBreadCrumb] = useState([]);

  getFlattenRoutes(routes);

  const routeMap = useRef<Map<string, React.ReactNode[]>>(new Map());

  const renderRoutes = (locale: { [x: string]: any }) => {
    routeMap.current.clear();
    return function travel(_routes: IRoute[], level: number, parentNode = []) {
      return _routes.map((route) => {
        const { breadcrumb = true, hideInMenu } = route;
        const iconDom = getIcon(route);
        const titleDom = (
          <>
            {iconDom} {locale[route.name] || route.name}
          </>
        );
        routeMap.current.set(`/${route.key}`, breadcrumb ? [route.name] : []);
        return (
          <MenuItem key={route.key}>
            <Link to={`/${route.key}`}>{titleDom}</Link>
          </MenuItem>
        );
      });
    };
  };

  const handleClickBtn = () => {
    setCollapsed((e) => !e);
  };

  useEffect(() => {
    const routeConfig = routeMap.current.get(pathname);
    setBreadCrumb(routeConfig);
  }, [pathname]);

  return (
    <Layout className={styles.layout}>
      <div className={cs(styles["layout-navbar"])}>
        <Navbar show />
      </div>
      {userLoading ? (
        <Spin className={styles["spin"]} />
      ) : (
        <Layout className={styles["layout-maincontent"]}>
          <Sider
            collapsed={collapsed}
            collapsible
            trigger={null}
            breakpoint="xl"
            width={menuWidth}
            onCollapse={setCollapsed}
            className={styles["layout-sider"]}
          >
            <div className={styles["menu-wrapper"]}>
              <Menu
                selectedKeys={selectedKeys}
                onClickMenuItem={(e) => setSelectedKeys([e])}
              >
                {renderRoutes(locale)(routes, 1)}
              </Menu>
              <div
                className={styles["collapse-btn"]}
                onClick={() => {
                  handleClickBtn();
                }}
              >
                {collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
              </div>
            </div>
          </Sider>
          <Layout className={styles["layout-content"]} style={paddingLeft}>
            <div className={styles["layout-content-wrapper"]}>
              {!!breadcrumb?.length && (
                <div className={styles["layout-breadcrumb"]}>
                  <Breadcrumb style={{ margin: "16px 0" }}>
                    {breadcrumb.map((node, index) => (
                      <Breadcrumb.Item key={index}>
                        {typeof node === "string" ? locale[node] : node}
                      </Breadcrumb.Item>
                    ))}
                  </Breadcrumb>
                </div>
              )}
              <Content className={styles.content}>
                {/* <Routes>
                  {flattenRoutes.map((route, index) => {
                    return (
                      <Route
                        key={index}
                        path={`/${route.key}`}
                        element={<route.component />}
                      />
                    );
                  })}
                  <Route path="/" element={<Navigate to={`/`} />} />
                </Routes> */}
                <Routes>
                  <Route path="/work" element={<Work />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/category" element={<Category />} />
                  <Route path="/" element={<Navigate to={`/work`} />} />
                  <Route path="*" element={<NOTFOUND403 />} />
                </Routes>
              </Content>
            </div>
            <Footer />
          </Layout>
        </Layout>
      )}
    </Layout>
  );
};

export default PageLayout;
