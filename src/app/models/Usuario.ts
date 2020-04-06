import { Sexo } from './Sexo';

export interface Usuario {

  userId: number;
  nome: string;
  dataNascimento: Date;
  email: string;
  senha: string;
  ativo: boolean;
  sexoId: number;
  sexo: Sexo[];
}
