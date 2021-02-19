import { FilterAttribute } from "./filter-attribute.model";
import { JoinAttribute } from "./join-attribute.model";
import { OrderAttribute } from "./order-attribute.model";
import { QueryPagination } from "./query-pagination.model";

export class Query {
  alias?: string;
  join?: JoinAttribute[];
  filter?: FilterAttribute[];
  orderBy?: OrderAttribute[];
  pagination?: QueryPagination;
}