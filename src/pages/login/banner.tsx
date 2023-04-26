import React from "react";
import { Carousel } from "@arco-design/web-react";
import locale from "./locale";
import styles from "./style/index.module.less";
import useLocale from "@/utils/useLocale";
import swiperItem1 from "@/assets/images/loginPicture.png";

export default function LoginBanner() {
  const t = useLocale(locale);
  const data = [
    {
      slogan: t["login.banner.slogan1"],
      subSlogan: t["login.banner.subSlogan1"],
      image: swiperItem1,
    },
    {
      slogan: t["login.banner.slogan1"],
      subSlogan: t["login.banner.subSlogan1"],
      image: swiperItem1,
    },
    {
      slogan: t["login.banner.slogan1"],
      subSlogan: t["login.banner.subSlogan1"],
      image: swiperItem1,
    },
  ];
  return (
    <Carousel className={styles.carousel} animation="card">
      {data.map((item, index) => (
        <div key={`${index}`}>
          <div className={styles["carousel-item"]}>
            <div className={styles["carousel-title"]}>{item.slogan}</div>
            <div className={styles["carousel-sub-title"]}>{item.subSlogan}</div>
            <img
              alt="banner-image"
              className={styles["carousel-image"]}
              src={item.image}
            />
          </div>
        </div>
      ))}
    </Carousel>
  );
}
