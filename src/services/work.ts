import axios from "@/utils/request";
import { IToBeReviewed, IWorkType } from '~/work/types'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Notification } from "@arco-design/web-react";

export type Response = { data: unknown; info: string; status: number };

export const useAllWork = () => 
  useQuery<IWorkType []>(
    ['allWork'],
    () => 
      axios.get(`/work`).then(res => res.data),
      {refetchOnWindowFocus: false}
  )

export const useDeleteWork = () => {
  const queryClient = useQueryClient();

  return useMutation(async (article_id: number) => {
    const result: Response = await axios.delete(`/work`, {
      data: {article_id}
    })
    console.log('result', result);
    afterRequest(
      result,
      () => {
        Notification.success({ content: '删除成功' });
        queryClient.invalidateQueries(['allWork']); // 重新获取账号列表
      },
      () => {
        Notification.error({
          title: '删除失败',
          content: result.info,
        });
      }
    )
  });
}


export const operateWork = async ({article_id, worker_id, op}: IToBeReviewed) => {
  const data = await axios.patch(`/work/audit`, {
    article_id,
    worker_id,
    op
  });
  return data;
};

export const useOperateWork = () => {
  const queryClient = useQueryClient();

  return useMutation(async ({article_id, worker_id, op}: IToBeReviewed) => {
    const result: Response = await axios.patch(`/work/audit`, {
      article_id,
      worker_id,
      op
    });
    afterRequest(
      result,
      () => {
        Notification.success({ content: '操作成功' });
        queryClient.invalidateQueries(['allWork']); // 重新获取账号列表
      },
      () => {
        Notification.error({
          title: '操作失败',
          content: result.info,
        });
      }
    )
  })
}


/** @description 请求后的操作 */
export function afterRequest(
  result: Response,
  success?: () => void,
  error?: () => void
) {
  if (result.status === 10001) {
    if (success) success();
    else Notification.success({ content: '操作成功' });
  } else {
    if (error) error();
    else
      Notification.error({
        title: '操作失败',
        content: result.info,
      });
    throw new Error();
  }
}
