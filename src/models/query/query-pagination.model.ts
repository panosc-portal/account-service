export class QueryPagination {
  static MAX_QUERY_LIMIT: 200;
  offset: number;
  limit: number;

  constructor(data?: Partial<QueryPagination>) {
    Object.assign(this, data);
  }
}