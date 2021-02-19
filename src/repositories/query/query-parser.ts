import { QueryBuilder, SelectQueryBuilder } from "typeorm";
import { Query } from "../../models";
import { logger } from "../../utils";

export class QueryParser<T> {
  private _queryBuilder: SelectQueryBuilder<T>;

  constructor(private _query: Query, private _builder: (alias: string) => SelectQueryBuilder<T>) {
  }

  parse(): SelectQueryBuilder<T> {
    this._queryBuilder = this._builder(this._query.alias);

    // Handle joins
    if (this._query.join) {
      this._query.join.forEach(join => {
        if (join.type === 'LEFT_JOIN' && join.select) {
          this._queryBuilder = join.select ? 
            this._queryBuilder.innerJoinAndSelect(join.member, join.alias) : 
            this._queryBuilder.innerJoin(join.member, join.alias);
  
        } else if (join.type === 'LEFT_OUTER_JOIN') {
          this._queryBuilder = join.select ? 
            this._queryBuilder.leftJoinAndSelect(join.member, join.alias) :
            this._queryBuilder.leftJoin(join.member, join.alias)
        
        } else {
          logger.warn(`Unrecognised join type: ${join.type}`);
        }
      });
    }

    // Handle filters
    if (this._query.filter) {
      this._query.filter.forEach((filter, index) => {
        const filterString = `${filter.alias} ${filter.comparator} :${filter.parameter}`;
        const value = 
          filter.valueType === 'number' ? +filter.value : 
          filter.valueType === 'boolean' ? filter.value === 'true' : 
          filter.value;
        this._queryBuilder = index === 0 ?
          this._queryBuilder.where(filterString).setParameter(filter.parameter, value) :
          this._queryBuilder.andWhere(filterString).setParameter(filter.parameter, value);
      })
    }

    // Handle order bys
    if (this._query.orderBy) {
      this._query.orderBy.forEach((orderBy, index) => {
        const direction = orderBy.direction === 'DESC' ? 'DESC' : 'ASC';
        this._queryBuilder = index === 0 ?
          this._queryBuilder.orderBy(orderBy.alias, direction) :
          this._queryBuilder.addOrderBy(orderBy.alias, direction);
      })
    }

    return this._queryBuilder;
  } 

}