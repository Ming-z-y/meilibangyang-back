import { useAddAccount } from "@/services/account";
import useLocale from "@/utils/useLocale";
import { Modal, Form, Input } from "@arco-design/web-react";
import { FC } from "react";

const FormItem = Form.Item;

interface IAdd {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddAccountModal: FC<IAdd> = ({ visible, setVisible }: IAdd) => {
  const [form] = Form.useForm();
  const t = useLocale();
  const { mutateAsync } = useAddAccount();

  return (
    <>
      <Modal
        title={t["menu.account.addAccount"]}
        visible={visible}
        onOk={() => {
          try {
            form.validate().then((res) => {
              mutateAsync(res).then((res) => {
                setVisible(false);
                form.clearFields();
              });
            });
          } catch {}
        }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Form form={form}>
          {/* 昵称name */}
          <FormItem
            label="昵称"
            field={"name"}
            title={"昵称"}
            rules={[{ required: true, message: "此为必填项" }]}
          >
            <Input placeholder="输入昵称" />
          </FormItem>
          <FormItem
            label="用户名"
            field={"user_name"}
            title={"用户名"}
            rules={[{ required: true, message: "此为必填项" }]}
          >
            <Input placeholder="输入用户名" />
          </FormItem>
          <FormItem
            label="密码"
            field="password"
            title="密码"
            rules={[{ required: true, message: "此为必填项" }]}
          >
            <Input placeholder="输入登录密码" />
          </FormItem>
          <FormItem
            label="手机号"
            field="phone"
            title="手机号"
            rules={[{ required: true, message: "此为必填项" }]}
          >
            <Input placeholder="输入绑定的手机号" />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};
