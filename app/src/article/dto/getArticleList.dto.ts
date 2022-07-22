export interface getArticleListOption {
  limit?: number;
  offset?: number;
  search?: string;
  filter?: string;
  order?: string;
  orderBy?: string;
}

export enum orderOption {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum orderByOption {
  CREATEDAT = 'CreatedAt',
  TOTALVIEW = 'totalView',
  TOTALLIKE = 'totalLike',
}
