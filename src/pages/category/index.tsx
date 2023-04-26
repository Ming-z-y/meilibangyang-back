import { useState } from "react";
import styles from "./index.module.less";
import {
  useAddCategory,
  useAllCategory,
  useDeleteCategory,
} from "@/services/category";
import useStorage from "@/utils/useStorage";
import { Form, Modal, Popconfirm, Input } from "@arco-design/web-react";
import { message } from "antd";

const FormItem = Form.Item;

export const Category = () => {
  const [form] = Form.useForm();
  const [permission] = useStorage("permission");
  const categories = useAllCategory().data;
  const [isShowCategory, setIsShowCategory] = useState(false);
  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const { mutateAsync: addCategory } = useAddCategory();
  return (
    <>
      <div className={styles.title}>类别删减</div>
      {categories &&
        categories.map((item, index) => {
          return (
            <div className={styles.eachColumn} key={index}>
              <div className={styles.eachCate}>{item}</div>
              <Popconfirm
                // focusLock
                title="确定要删除本类别吗？"
                onOk={() => {
                  if (permission != "超级管理员") {
                    message.error("账号权限不够");
                  } else {
                    deleteCategory(item);
                  }
                }}
              >
                <div className={styles.operateBtn}>
                  <div className={styles.subIcon}></div>
                </div>
              </Popconfirm>
            </div>
          );
        })}
      <div className={styles.eachColumn}>
        <div className={styles.addCateTitle}>类别</div>
        <div
          className={styles.addCateBtn}
          onClick={() => {
            setIsShowCategory(true);
          }}
        >
          +
        </div>
      </div>

      <Modal
        visible={isShowCategory}
        onOk={() => {
          try {
            if (permission != "超级管理员") {
              message.error("账号权限不够");
            } else {
              form.validate().then((res) => {
                addCategory(res.category).then(() => {
                  setIsShowCategory(false);
                  form.clearFields();
                });
              });
            }
          } catch {}
        }}
        onCancel={() => setIsShowCategory(false)}
        title="增加类别"
      >
        <Form form={form}>
          {/* 昵称name */}
          <FormItem
            label="类别"
            field={"category"}
            title={"类别"}
            rules={[{ required: true, message: "此为必填项" }]}
          >
            <Input placeholder="输入类别" />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};
