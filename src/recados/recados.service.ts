import { Injectable } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { CreateRecadoDto } from './dto/create-recado.dto';

@Injectable()
export class RecadosService {
  #recadosList = [];

  getAll() {
    return this.#recadosList;
  }

  getOne(id: number) {
    // update 'seen' status and return the element
    this.update(id, { seen: true });
    return this.#recadosList.find((item) => item.id === id);
  }

  create(createRecadoDto: CreateRecadoDto) {
    // get values
    const { recado, from, to } = createRecadoDto;

    // create new instance of Recado and append it to the list
    const newRecado = new Recado(recado, from, to);
    this.#recadosList.push(newRecado);

    return newRecado;
  }

  update(id: number, updateRecadoDto: UpdateRecadoDto) {
    // get values
    const { recado, from, to, seen } = updateRecadoDto;

    // get the index of the selected element
    const recadoIndex = this.#recadosList.findIndex((item) => item.id === id);
    const recadoObj = this.#recadosList[recadoIndex];

    // update all the given values
    if (recadoIndex >= 0) {
      if (recado !== undefined) recadoObj.recado = recado;
      if (recado !== undefined) recadoObj.from = from;
      if (from !== undefined) recadoObj.from = from;
      if (to !== undefined) recadoObj.to = to;
      if (seen !== undefined) recadoObj.seen = seen;

      return recadoObj;
    }
    // return undefined if the element wasn't fount
    else {
      return undefined;
    }
  }

  remove(id: number) {
    // get the index of the selected element
    const recadoIndex = this.#recadosList.findIndex((item) => item.id === id);

    // remove element and return true if it was found or false if it was not
    if (recadoIndex >= 0) {
      this.#recadosList.splice(recadoIndex, 1);
      return true;
    } else {
      return false;
    }
  }
}
