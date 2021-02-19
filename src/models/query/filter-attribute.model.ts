export class FilterAttribute {
  alias: string;           // user.name
  parameter: string;       // name (converted to :name)
  value: string;           // aName%
  valueType?: string;      // number, boolean, string
  comparator: string;      // like, =, <
}