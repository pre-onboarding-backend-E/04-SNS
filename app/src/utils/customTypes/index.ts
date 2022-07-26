import { SortOrder } from 'mongoose';

export type SortByType = 'createdAt' | 'likes' | 'views' | 'comments';
export type SortBysType = SortByType[];
export const SortBys: SortBysType = ['createdAt', 'likes', 'views', 'comments'];
export enum SortByEnum {
  createdAt = 'createdAt',
  likes = 'likes',
  views = 'views',
  comments = 'comments',
}

export type OrderByType = 'asc' | 'desc';
export type OrderBysType = OrderByType[];
export const OrderBys: OrderByType[] = ['asc', 'desc'];
export const OrderByEnum: SortOptions = {
  asc: 1,
  desc: -1,
};

export type SortOptions = string | { [key: string]: SortOrder | { $meta: 'textScore' } } | undefined | null;

export interface SuccessResponse {
  code: number;
  message: string;
  type?: any;
}

export interface ResponseData<T> {
  code: number;
  message: string;
  data: T | null;
}
