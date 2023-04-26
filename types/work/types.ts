export interface IToBeReviewed {
  article_id: number;
  worker_id: number;
  op: boolean;
}

export interface IWorkType {
  user_id: number;
  username: string;
  article_name: string;
  status: '审核通过' | '审核中';
  article_id: number;
  category: string;
  create_time: string;
  content_url: string;
  scope: number
}