import React, { useEffect } from "react";
import Footer from "../../components/Footer";
import LoginForm from "./form";
import LoginBanner from "./banner";
import styles from "./style/index.module.less";

function Login() {
  useEffect(() => {
    document.body.setAttribute("arco-theme", "light");
  }, []);

  return (
    <div className={styles.container}>
      {/* <div className={styles.logo}>
        <div className={styles['logo-text']}>重邮帮后台管理</div>
      </div> */}
      <div className={styles.banner}>
        <div className={styles["banner-inner"]}>
          <LoginBanner />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles["content-inner"]}>
          <LoginForm />
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
Login.displayName = "LoginPage";

export default Login;
