import { QueryPagination } from "./query";

export class Paginated<T> {
  
  public data: T[];
  public meta: {
    count: number,
    offset: number,
    limit: number
  } = {count: 0, offset: 0, limit: 0};

  constructor(data: T[], count:number, pagination: QueryPagination) {
    this.data = data;
    this.meta.count = count;
    if (pagination) {
      this.meta.offset = pagination.offset;
      this.meta.limit = pagination.limit;

    } else {
      this.meta.offset = 0;
      this.meta.limit = count;
    }
  }

} 