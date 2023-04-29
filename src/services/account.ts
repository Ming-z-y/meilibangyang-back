import axios from "@/utils/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IAccountType, IAddAccount } from "~/account/types";
import { Notification } from "@arco-design/web-react";
import { afterRequest } from "./work";
import type { Response } from "./work";

export const useAllAccount = () => 
  useQuery<IAccountType[]>(
    ["allAccount"],
    () => axios.get(`/buser`).then((res) => res.data),
    { refetchOnWindowFocus: false }
  );

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation(async (user_id: string) => {
    const result: Response = await axios.delete(`/buser`, {
      data: {user_id}
    });
    afterRequest(
      result,
      () => {
        Notification.success({ content: "删除成功" });
        queryClient.invalidateQueries(["allAccount"]);
      },
      () => {
        Notification.error({
          title: "删除失败",
          content: result.info,
        });
      }
    );
  });
};

export const useAddAccount = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ user_name, password, name, level = 1, phone }: IAddAccount) => {
      const result: Response = await axios.post(`/account`, {
        user_name,
        password,
        name,
        level,
        phone
      })
      afterRequest(
        result,
        () => {
          Notification.success({ content: "增加成功" });
          queryClient.invalidateQueries(["allAccount"]);
        },
        () => {
          Notification.error({
            title: "增加失败",
            content: result.info,
          });
        }
      );
    }
  );
};
