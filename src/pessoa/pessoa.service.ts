import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';

@Injectable()
export class PessoaService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
  ) {}

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      // get values
      const { name, email, password } = createPessoaDto;

      // create hash
      const passwordHash = password;

      // create registry
      const newPessoa = this.pessoaRepository.create({
        name,
        email,
        passwordHash,
      });

      // save to database
      return await this.pessoaRepository.save(newPessoa);
    } catch (error) {
      // throw conflict exception if email is already registered
      if (error.code === '23505') {
        throw new ConflictException('Este email já foi cadastrado');
      }

      throw error;
    }
  }

  async findOne(id: number) {
    // search for the registry
    const pessoa = await this.pessoaRepository.findBy({ id });

    // return the registry or throw not found exception
    if (pessoa.length) {
      return pessoa[0];
    } else {
      throw new NotFoundException('Pessoa não encontrada');
    }
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    // get values
    const { name, password } = updatePessoaDto;
    const passwordHash = password;

    // throw bad request if updatePessoaDto is empty
    if (!(name && password)) {
      throw new BadRequestException('Requisição vazia');
    }

    // search and update the registry
    const newPessoa = await this.pessoaRepository.preload({
      id,
      name,
      passwordHash,
    });

    // save changes or throw not found exception
    if (newPessoa) {
      this.pessoaRepository.save(newPessoa);
      return newPessoa;
    } else {
      throw new NotFoundException('Pessoa não encontrada');
    }
  }

  async remove(id: number) {
    // perform delete operation and get the number of affected rows
    const affected = (await this.pessoaRepository.delete(id)).affected;

    // if no rows were affected, throw not found exception
    if (!affected) {
      throw new NotFoundException('Pessoa não encontrada');
    }
  }
}
