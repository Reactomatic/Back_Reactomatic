export class Component {
  constructor(component?: Partial<Component>) {
    this.id = component?.id;
    this.name = component?.name;
    this.price = component?.price;
    this.brand = component?.brand;
    this.type = component?.type;
  }

  id: number;
  name: string;
  price: number;
  brand: string;
  type: string;
  metadata: [];
}
