export class FilterAttribute {
  alias: string;           // user.name
  parameter: string;       // name (converted to :name)
  value: string;           // aName%, 23, test, [1,2,3]
  valueType?: string;      // number, boolean, string, number[], boolean[], string[]
  comparator: string;      // like, =, <
}