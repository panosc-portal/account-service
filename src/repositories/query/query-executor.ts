import { SelectQueryBuilder } from "typeorm";
import { Query, QueryError } from "../../models";
import { logger } from "../../utils";

export class QueryExecutor<T> {

  constructor(private _query: Query, private _builder: (alias: string) => SelectQueryBuilder<T>) {
    // construct default query properties
    this._query.join = this._query.join ? this._query.join : [];
    this._query.filter = this._query.filter ? this._query.filter : [];
    this._query.orderBy = this._query.orderBy ? this._query.orderBy : [];
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
    if (this._query.pagination) {
      queryBuilder.limit(this._query.pagination.limit);
      queryBuilder.offset(this._query.pagination.offset);
    }

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
      let isArray = false;
      let value: any
      if (filter.valueType === 'number') {
        value = +filter.value;
      
      } else if (filter.valueType === 'boolean') {
        value = filter.value === 'true';
      
      } else if (filter.valueType === 'string[]') {
        isArray = true;
        value = JSON.parse(filter.value);
        if (!Array.isArray(value)) {
          throw new QueryError('Value is not an array');
        }
      
      } else if (filter.valueType === 'number[]') {
        isArray = true;
        const stringArray: string[] = JSON.parse(filter.value);
        if (!Array.isArray(stringArray)) {
          throw new QueryError('Value is not an array');
        }
        value = stringArray.map(element => +element);
      
      } else if (filter.valueType === 'boolean[]') {
        isArray = true;
        const stringArray: string[] = JSON.parse(filter.value);
        if (!Array.isArray(stringArray)) {
          throw new QueryError('Value is not an array');
        }
        value = stringArray.map(element => element === 'true');
      
      } else {
        value = filter.value;
      }

      // Validate array has 'in' comparator
      if (isArray && filter.comparator.toLowerCase() !== 'in') {
        throw new QueryError('Array value type should have an IN comparator');

      } else if (!isArray && filter.comparator.toLowerCase() === 'in') {
        throw new QueryError('In comparator should have an array value type');
      }

      const filterString = isArray ? 
        `${filter.alias} IN (:...${filter.parameter})` :
        `${filter.alias} ${filter.comparator} :${filter.parameter}`;

      queryBuilder = index === 0 ?
        queryBuilder.where(filterString).setParameter(filter.parameter, value) :
        queryBuilder.andWhere(filterString).setParameter(filter.parameter, value);
    });

    return queryBuilder;
  }

}