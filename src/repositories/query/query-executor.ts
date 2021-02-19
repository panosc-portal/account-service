import { QueryFailedError, SelectQueryBuilder } from "typeorm";
import { Query, QueryPagination } from "../../models";
import { logger } from "../../utils";

export class QueryExecutor<T> {

  constructor(private _query: Query, private _builder: (alias: string) => SelectQueryBuilder<T>) {
    // construct default query properties
    this._query.join = this._query.join ? this._query.join : [];
    this._query.filter = this._query.filter ? this._query.filter : [];
    this._query.orderBy = this._query.orderBy ? this._query.orderBy : [];
    this._query.pagination = this._query.pagination ? this._query.pagination : new QueryPagination({offset: 0, limit: QueryPagination.MAX_QUERY_LIMIT});
  }

  async results(): Promise<T[]> {
    let queryBuilder = this._builder(this._query.alias);

    // Handle joins
    queryBuilder = this._appendJoins(queryBuilder);

    // Handle filters
    queryBuilder = this._appendFilters(queryBuilder);

    // Handle order bys
    this._query.orderBy.forEach((orderBy, index) => {
      const direction = orderBy.direction === 'DESC' ? 'DESC' : 'ASC';
      queryBuilder = index === 0 ?
        queryBuilder.orderBy(orderBy.alias, direction) :
        queryBuilder.addOrderBy(orderBy.alias, direction);
    });

    // Handle pagination
    queryBuilder.limit(this._query.pagination.limit);
    queryBuilder.offset(this._query.pagination.offset);

    const results = await queryBuilder.getMany();
    return results;
  } 

  async count(): Promise<number> {
    let queryBuilder = this._builder(this._query.alias);

    if (this._query.alias) {
      queryBuilder = queryBuilder.select(`count(${this._query.alias}.id)`, 'count');

    } else {
      queryBuilder = queryBuilder.select(`count(id)`, 'count');
    }

    // Handle joins
    queryBuilder = this._appendJoins(queryBuilder, false);

    // Handle filters
    queryBuilder = this._appendFilters(queryBuilder);

    const countResult = await queryBuilder.getRawOne();

    return countResult.count;
  }

  private _appendJoins(queryBuilder: SelectQueryBuilder<T>, allowSelect: boolean = true): SelectQueryBuilder<T> {
    this._query.join.forEach(join => {
      if (join.type === 'LEFT_JOIN' && join.select) {
        queryBuilder = (join.select &&  allowSelect) ? 
          queryBuilder.innerJoinAndSelect(join.member, join.alias) : 
          queryBuilder.innerJoin(join.member, join.alias);

      } else if (join.type === 'LEFT_OUTER_JOIN') {
        queryBuilder = (join.select && allowSelect) ? 
          queryBuilder.leftJoinAndSelect(join.member, join.alias) :
          queryBuilder.leftJoin(join.member, join.alias)
      
      } else {
        logger.warn(`Unrecognised join type: ${join.type}`);
      }
    });

    return queryBuilder;
  }

  private _appendFilters(queryBuilder: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    this._query.filter.forEach((filter, index) => {
      const filterString = `${filter.alias} ${filter.comparator} :${filter.parameter}`;
      const value = 
        filter.valueType === 'number' ? +filter.value : 
        filter.valueType === 'boolean' ? filter.value === 'true' : 
        filter.value;
      queryBuilder = index === 0 ?
        queryBuilder.where(filterString).setParameter(filter.parameter, value) :
        queryBuilder.andWhere(filterString).setParameter(filter.parameter, value);
    });

    return queryBuilder;
  }

}