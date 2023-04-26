import { useState, useEffect } from "react";
import { Button, Modal, Popconfirm, Table } from "@arco-design/web-react";
import { ColumnProps } from "@arco-design/web-react/es/Table";
import Search from "@/components/Search";
import { Tabs } from "antd";
import { IWorkType } from "~/work/types";
import useSeek from "@/utils/useSeek";
import { useAllWork, useDeleteWork, useOperateWork } from "@/services/work";
import styles from "./index.module.less";
import axios from "axios";

interface IShowWork {
  article_name: string;
  content_url: string;
  scope: number;
}

export const Work = () => {
  const columnsPass: ColumnProps[] = [
    {
      title: "账号名称",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "作品名称",
      dataIndex: "article_name",
      width: "20%",
      align: "center",
    },
    {
      title: "作品类型",
      dataIndex: "category",
      width: "12.5%",
      align: "center",
    },
    {
      title: "发布时间",
      dataIndex: "create_time",
      width: "37.5%",
      align: "left",
    },
    {
      title: "操作",
      width: "12.5%",
      render: (_, record: IWorkType) => {
        const { article_name, content_url, scope } = record;
        return (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button
              type="text"
              onClick={() => {
                setWorkInfo({ article_name, content_url, scope });
                setShowWork(true);
              }}
            >
              查看
            </Button>
            {/* <Button type="text" status="danger">
              删除
            </Button> */}
            <Popconfirm
              // focusLock
              title="确定要删除本作品吗？"
              onOk={() => {
                handleDelete(record.article_id);
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

  const columnsUnPass: ColumnProps[] = [
    {
      title: "账号名称",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "作品名称",
      dataIndex: "article_name",
      width: "20%",
      align: "center",
    },
    {
      title: "作品类型",
      dataIndex: "category",
      width: "12.5%",
      align: "center",
    },
    {
      title: "发布时间",
      dataIndex: "create_time",
      width: "37.5%",
      align: "left",
    },
    {
      title: "操作",
      width: "12.5%",
      render: (_, record: IWorkType) => {
        const { article_name, content_url, scope } = record;
        return (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button
              type="text"
              onClick={() => {
                setWorkInfo({ article_name, content_url, scope });
                setShowWork(true);
              }}
            >
              查看
            </Button>
            <Popconfirm
              // focusLock
              title="确定要通过本作品吗？"
              onOk={() => {
                operateWork({
                  article_id: record.article_id,
                  worker_id: record.user_id,
                  op: true,
                });
              }}
            >
              <Button type="text">通过</Button>
            </Popconfirm>
            {/* <Button type="text" status="danger">
              删除
            </Button> */}
            <Popconfirm
              // focusLock
              title="确定要不通过本作品吗？"
              onOk={() => {
                operateWork({
                  article_id: record.article_id,
                  worker_id: record.user_id,
                  op: false,
                });
              }}
            >
              <Button type="text" status="danger">
                不通过
              </Button>
            </Popconfirm>
          </div>
        );
      },
      align: "center",
    },
  ];

  const [val, setVal] = useState("");
  const [content, setContent] = useState("");
  // const [_, res] = useSeek(val, sourceDate);
  const { mutateAsync: deleteWork } = useDeleteWork();
  const { mutateAsync: operateWork } = useOperateWork();
  const [showWork, setShowWork] = useState(false);
  const [workInfo, setWorkInfo] = useState<IShowWork>({
    article_name: "",
    content_url: "",
    scope: 0,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([
    "0",
  ]);

  const getContent = async (content_url: string) => {
    if (content_url != "") {
      const res = await axios.get(content_url);
      return res.data;
    }
    return "";
  };

  useEffect(() => {
    (async () => {
      const res = await getContent(workInfo.content_url);
      if (res != "") setContent(res);
    })();
  }, [workInfo]);

  const allWork = useAllWork().data;
  const passWork = allWork?.filter((item) => item.status === "审核通过");
  const unPassWork = allWork?.filter((item) => item.status === "审核中");

  function handleDelete(article_id: number) {
    deleteWork(article_id);
  }

  return (
    <>
      <Search val={val} setVal={setVal} />
      <Tabs
        type="card"
        items={["已通过", "待审核"].map((item, i) => {
          const id = String(i + 1);
          return i === 0
            ? {
                label: item,
                key: id,
                children: (
                  <Table
                    key={`pass-${id}`}
                    loading={passWork ? false : true}
                    border={false}
                    columns={columnsPass}
                    data={passWork}
                    rowKey="article_id"
                    rowSelection={{
                      selectedRowKeys,
                      type: "checkbox",
                      onChange: (selectedRowKeys, selectedRows) => {
                        setSelectedRowKeys(selectedRowKeys);
                      },
                    }}
                  />
                ),
              }
            : {
                label: item,
                key: id,
                children: (
                  <Table
                    key={`unPass-${id}`}
                    loading={unPassWork ? false : true}
                    border={false}
                    columns={columnsUnPass}
                    data={unPassWork}
                    rowKey="article_id"
                    rowSelection={{
                      selectedRowKeys,
                      type: "checkbox",
                      onChange: (selectedRowKeys, selectedRows) => {
                        setSelectedRowKeys(selectedRowKeys);
                      },
                    }}
                  />
                ),
              };
        })}
      />
      <Modal
        visible={showWork}
        onOk={() => setShowWork(false)}
        onCancel={() => setShowWork(false)}
        title="作品信息"
        footer={null}
        style={{ overflowY: "scroll" }}
      >
        <div className={styles.info_content}>
          <div className={styles.item_content}>
            作品名称：{workInfo.article_name}
          </div>
          <div className={styles.item_content}>
            作品链接：{workInfo.content_url}
          </div>
          <div className={styles.item_content}>作品详情：</div>
          <div className={styles.item_content}>
            {workInfo.scope == 1 ? (
              <>{content}</>
            ) : (
              <video
                autoPlay
                controls
                src={workInfo.content_url}
                width={480}
              ></video>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
