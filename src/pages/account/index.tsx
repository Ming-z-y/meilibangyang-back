import { useState } from "react";
import { Button, Modal, Popconfirm, Table } from "@arco-design/web-react";
import { ColumnProps } from "@arco-design/web-react/es/Table";
import Search from "@/components/Search";
import useLocale from "@/utils/useLocale";
import useSeek from "@/utils/useSeek";
import { AddAccountModal } from "./component";
import styles from "./index.module.less";
import { IAccountType } from "~/account/types";
import { useAllAccount, useDeleteAccount } from "@/services/account";

const sourceDate: IAccountType[] = [
  {
    username: "mzy",
    create_time: "2023.04.05",
    phone: "134801200401",
    diary_no: "731290387910283901",
    permission: "管理员",
  },
  {
    username: "tang",
    create_time: "2022.04.05",
    phone: "134801231401",
    diary_no: "7312523387910283901",
    permission: "管理员",
  },
];

export const Account = () => {
  const columns: ColumnProps[] = [
    {
      title: "账号名称",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      width: "60%",
      align: "left",
    },
    {
      title: "操作",
      width: "12.5%",
      render: (_, record: IAccountType, index) => {
        const { username, phone, diary_no } = record;
        return (
          <div
            key={index}
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <Button
              type="text"
              onClick={() => {
                setAccountInfo({ username, phone, diary_no });
                setShowAccount(true);
              }}
            >
              查看
            </Button>
            <Popconfirm
              // focusLock
              title="确定要删除本作品吗？"
              onOk={() => {
                mutateAsync(record.diary_no);
              }}
            >
              <Button type="text" status="danger">
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
      align: "center",
    },
  ];

  const [val, setVal] = useState("");
  const [_, res] = useSeek(val, sourceDate);
  const [visible, setVisible] = useState(false);
  const t = useLocale();
  const [showAccount, setShowAccount] = useState(false);
  const allAccount = useAllAccount();
  const { mutateAsync } = useDeleteAccount();
  const [accountInfo, setAccountInfo] = useState({
    diary_no: "",
    username: "",
    phone: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([
    "0",
  ]);
  return (
    <>
      <div className={styles.top}>
        <Search val={val} setVal={setVal} />
        <Button
          type="text"
          className={styles.addBtn}
          onClick={() => {
            setVisible(true);
          }}
        >
          {t["menu.account.addAccount"]}
        </Button>
      </div>
      <Table
        key={`id`}
        loading={allAccount.isLoading ? true : false}
        border={false}
        columns={columns}
        data={allAccount.data}
        rowKey="article_id"
        rowSelection={{
          selectedRowKeys,
          type: "checkbox",
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
      />
      <AddAccountModal visible={visible} setVisible={setVisible} />
      <Modal
        visible={showAccount}
        onOk={() => setShowAccount(false)}
        onCancel={() => setShowAccount(false)}
        title="账号信息"
        footer={null}
      >
        <div className={styles.info_content}>
          <div className={styles.item_content}>手机号：{accountInfo.phone}</div>
          <div className={styles.item_content}>
            账号名称：{accountInfo.username}
          </div>
          <div className={styles.item_content}>
            日记号：{accountInfo.diary_no}
          </div>
        </div>
      </Modal>
    </>
  );
};
