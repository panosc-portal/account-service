export class Paginated<T> {
  
  constructor(public data: T[], public meta: {count: number, offset: number, limit: number}) {
  }

} 