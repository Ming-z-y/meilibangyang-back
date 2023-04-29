import {
  Form,
  Input,
  Button,
  Space,
  Notification,
  Modal,
} from "@arco-design/web-react";
import { FormInstance } from "@arco-design/web-react/es/Form";
import { IconLock, IconUser } from "@arco-design/web-react/icon";
import { useRef, useState } from "react";
import axios from "@/utils/request";
import { useNavigate } from "react-router-dom";
import useStorage from "@/utils/useStorage";
// import {} from ''
import useLocale from "@/utils/useLocale";
import locale from "./locale";
import styles from "./style/index.module.less";
import { useRecoilState } from "recoil";
import { globalState } from "@/store/atom";

export default function LoginForm() {
  const navigate = useNavigate();
  const formRef = useRef<FormInstance>();
  const [errorMessage, setErrorMessage] = useState("");
  const [tipVisible, setTipVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setToken] = useStorage("token");
  const [, setRreshToken] = useStorage("refresh_token");
  const [, setUserStatus] = useStorage("userStatus");
  const [, setPermission] = useStorage("permission");
  const [global, setGlobal] = useRecoilState(globalState);

  const t = useLocale(locale);
  function forgetTip() {
    setTipVisible(true);
  }
  async function login(params) {
    setErrorMessage("");
    setLoading(true);
    try {
      const res = await axios.post(`/user/login`, params);
      if (res.status === 50099) {
        // @ts-ignore
        setErrorMessage(res.info || t["login.from.login.errMsg"]);
        setLoading(false);
      } else {
        setToken(res.data.access_token);
        setUserStatus("login");
        setPermission(res.data.permission);
        setRreshToken(res.data.refresh_token);
        setGlobal({
          ...global,
          userInfo: { permissions: res.data.permission },
        });
        setLoading(false);
        navigate("/", { replace: true });
      }
    } catch (error) {
      Notification.error({
        title: `请求错误`,
        content: error.response?.data?.info || "Error",
        duration: 1500,
      });
      setUserStatus("logout");
      setLoading(false);
    }
  }

  function onSubmitClick() {
    formRef.current.validate().then((values) => {
      login(values);
    });
  }

  return (
    <div className={styles["login-form-wrapper"]}>
      <div className={styles["login-form-title"]}>{t["login.form.title"]}</div>
      <div className={styles["login-form-sub-title"]}>
        Login to Charming role models
      </div>
      <div className={styles["login-form-error-msg"]}>{errorMessage}</div>
      <Form className={styles["login-form"]} layout="vertical" ref={formRef}>
        <Form.Item
          field="user_name"
          rules={[{ required: true, message: t["login.form.account.errMsg"] }]}
        >
          <Input
            prefix={<IconUser />}
            placeholder={t["login.form.account.placeholder"]}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="password"
          rules={[{ required: true, message: t["login.form.password.errMsg"] }]}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder={t["login.form.password.placeholder"]}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Space size={16} direction="vertical">
          <div className={styles["login-form-password-actions"]}>
            <Button type="text" onClick={forgetTip}>
              {t["login.form.forgetPassword"]}
            </Button>
          </div>
          <Button type="primary" long onClick={onSubmitClick} loading={loading}>
            {t["login.form.login"]}
          </Button>
        </Space>
      </Form>
      <Modal
        title="忘记密码"
        visible={tipVisible}
        onOk={() => setTipVisible(false)}
        onCancel={() => setTipVisible(false)}
        autoFocus={false}
        focusLock={true}
      >
        <p>如果忘记密码，请联系所属上级相关人员进行后续操作</p>
      </Modal>
    </div>
  );
}
