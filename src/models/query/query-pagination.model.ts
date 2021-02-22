export class QueryPagination {
  offset: number;
  limit: number;

  constructor(data?: Partial<QueryPagination>) {
    Object.assign(this, data);
  }
}