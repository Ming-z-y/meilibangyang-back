import React from "react";
import { Layout } from "@arco-design/web-react";
import { FooterProps } from "@arco-design/web-react/es/Layout/interface";
import cs from "classnames";
import styles from "./style/index.module.less";

function Footer(props: FooterProps = {}) {
  const { className, ...restProps } = props;
  return (
    <Layout.Footer className={cs(styles.footer, className)} {...restProps}>
      COPYRIGHT©红岩网校工作站
    </Layout.Footer>
  );
}

export default Footer;
