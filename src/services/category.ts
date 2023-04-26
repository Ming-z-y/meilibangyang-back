import axios from "@/utils/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Response, afterRequest } from "./work";
import { Notification } from "@arco-design/web-react";

export const useAllCategory = () => 
  useQuery<string []>(
    ['allCategory'],
    () => 
      axios.get(`/category`).then(res => res.data),
    {refetchOnWindowFocus: false}
  )


export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(async (category: string) => {
    const result: Response = await axios.post(`/category`, {category});
    afterRequest(
      result,
      () => {
        Notification.success({ content: '增加成功' });
        queryClient.invalidateQueries(['allCategory']); // 重新获取账号列表
      },
      () => {
        Notification.error({
          title: '添加失败',
          content: result.info,
        });
      }
    )
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(async (category: string) => {
    const result: Response = await axios.delete(`/category`, {
      data: {category}
    });
    afterRequest(
      result,
      () => {
        Notification.success({ content: '删除成功' });
        queryClient.invalidateQueries(['allCategory']); // 重新获取账号列表
      },
      () => {
        Notification.error({
          title: '删除失败',
          content: result.info,
        });
      }
    )
  })
}
