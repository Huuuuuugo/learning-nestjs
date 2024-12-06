export class Recado {
  static id = 0;
  id: number;
  recado: string;
  from: string;
  to: string;
  date: Date;
  seen: boolean;

  constructor(recado: string, from: string, to: string) {
    // id
    this.id = Recado.id;
    Recado.id++;

    // user assigned properties
    this.recado = recado;
    this.from = from;
    this.to = to;

    // automatically assigned properties
    this.date = new Date();
    this.seen = false;
  }
}
