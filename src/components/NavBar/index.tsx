import React, { useContext } from "react";
import {
  Tooltip,
  Avatar,
  Select,
  Dropdown,
  Menu,
  Message,
  Link,
} from "@arco-design/web-react";
import {
  IconLanguage,
  IconSunFill,
  IconMoonFill,
  IconPoweroff,
  IconLoading,
} from "@arco-design/web-react/icon";
import { GlobalContext } from "@/context";
import useLocale from "@/utils/useLocale";
import Logo from "@/assets/logo.png";
import IconButton from "./IconButton";
import styles from "./style/index.module.less";
import defaultLocale from "@/locale";
import useStorage from "@/utils/useStorage";
import { useRecoilState } from "recoil";
import { globalState } from "@/store/atom";
import { useNavigate } from "react-router";

function Navbar({}: { show: boolean }) {
  const navigate = useNavigate();
  const t = useLocale();
  const userInfo = useRecoilState(globalState)[0].userInfo;
  const userLoading = useRecoilState(globalState)[0].userLoading;
  const [global, setGlobal] = useRecoilState(globalState);

  const [, setUserStatus] = useStorage("userStatus");
  const [, , removeToken] = useStorage("token");
  const [, , removeLevel] = useStorage("userLevel");
  const [, , removeId] = useStorage("userId");
  const [, , removeAvatar] = useStorage("userAvatar");

  const { setLang, lang, theme, setTheme } = useContext(GlobalContext);

  function logout() {
    setGlobal({
      ...global,
      userInfo: {},
    });
    setUserStatus("logout");
    removeToken();
    removeLevel();
    removeId();
    removeAvatar();
    navigate("/login", { replace: true });
  }

  function onMenuItemClick(key) {
    if (key === "logout") {
      logout();
    } else {
      Message.info(`You clicked ${key}`);
    }
  }

  const droplist = (
    <Menu onClickMenuItem={onMenuItemClick}>
      <Menu.Item key="logout">
        <IconPoweroff className={styles["dropdown-icon"]} />
        {t["navbar.logout"]}
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <img src={Logo}></img>
          <div className={styles["logo-name"]}>魅力榜样</div>
        </div>
      </div>
      <ul className={styles.right}>
        <li>
          <Link href="javascript:;" icon>
            {t["navbar.help"]}
          </Link>
          {/* <Input.Search
            className={styles.round}
            placeholder={t['navbar.search.placeholder']}
          /> */}
        </li>
        <li>
          <Select
            triggerElement={<IconButton icon={<IconLanguage />} />}
            options={[
              { label: "中文", value: "zh-CN" },
              { label: "English", value: "en-US" },
            ]}
            value={lang}
            triggerProps={{
              autoAlignPopupWidth: false,
              autoAlignPopupMinWidth: true,
              position: "br",
            }}
            trigger="hover"
            onChange={(value) => {
              setLang(value);
              const nextLang = defaultLocale[value];
              Message.info(`${nextLang["message.lang.tips"]}${value}`);
            }}
          />
        </li>
        <li>
          <Tooltip
            content={
              theme === "light"
                ? t["settings.navbar.theme.toDark"]
                : t["settings.navbar.theme.toLight"]
            }
          >
            <IconButton
              icon={theme !== "dark" ? <IconMoonFill /> : <IconSunFill />}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            />
          </Tooltip>
        </li>
        {/* <Settings /> */}
        {userInfo && (
          <li>
            <span className={styles["name"]}>{userInfo.name}</span>
            <Dropdown droplist={droplist} position="br">
              <Avatar size={32} style={{ cursor: "pointer" }}>
                {userLoading ? (
                  <IconLoading />
                ) : (
                  <img alt="avatar" src={userInfo.avatar} />
                )}
              </Avatar>
            </Dropdown>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
