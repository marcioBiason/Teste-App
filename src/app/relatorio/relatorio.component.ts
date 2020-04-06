import { Usuario } from './../models/Usuario';
import { UsuarioService } from './../services/usuario.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { templateJitUrl } from '@angular/compiler';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {

  usuario: Usuario;
  usuarios: Usuario[];
  usuariosFiltrados: Usuario[];
  modoSalvar = 'post';
  bodyDeletarEvento = '';
  registerForm: FormGroup;
  selectedOption: boolean;
  selectedSexo: string;

  options = [
    { name: 'Ativo', value: 1 },
    { name: 'Inativo', value: 2 }
  ]

  sexo = [
    { name: 'Masculino', value: 1 },
    { name: 'Feminino', value: 4 }
  ]

  constructor(
    private usuarioService: UsuarioService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) { }

  // tslint:disable-next-line: variable-name
  _filtroNome: string;
  get filtroNome(): string {
    return this._filtroNome;
  }
  set filtroNome(value: string) {
    this._filtroNome = value;
    this.usuariosFiltrados = this.filtroNome ? this.filtrarUsuario(this.filtroNome) : this.usuarios;
  }

  editarUsuario(usuario: Usuario, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.usuario = usuario;
    this.registerForm.patchValue(usuario);
  }

  filtrarAtivos() {
    this.usuarioService.getUsuariosAtivos(this.selectedOption).subscribe(
      (usuari: Usuario[]) => {
        this.usuarios = usuari;
      }, error => {
        console.log(error);
      });
  }

  novoUsuario(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  ngOnInit() {
    this.getUsuarios();
    this.validacao();
  }

  filtrarUsuario(filtrarPor: string): Usuario[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.usuarios.filter(
      usuario => usuario.nome.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  validacao() {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      dataNascimento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      sexoId: '4'
    });
  }

  salvar(template: any) {
    if (this.registerForm.valid) {
      if (this.selectedSexo === 'Masculino') {
        this.registerForm.controls['sexoId'].setValue(4);
      } else {
        this.registerForm.controls['sexoId'].setValue(1);
      }
      if (this.modoSalvar === 'post') {
        this.usuario = Object.assign({}, this.registerForm.value);
        this.usuarioService.postUsuario(this.usuario).subscribe(
          (novoUsuario: Usuario) => {
            console.log(novoUsuario);
            template.hide();
            this.getUsuarios();
          }, error => {
            console.log(error);
          }
        );
      } else {
        this.usuario = Object.assign({ id: this.usuario.userId }, this.registerForm.value);
        this.usuarioService.putUsuario(this.usuario).subscribe(
          (novoUsuario: Usuario) => {
            console.log(novoUsuario);
            template.hide();
            this.getUsuarios();
          }, error => {
            console.log(error);
          }
        );
      }
    }
  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe(
      (usuari: Usuario[]) => {
        this.usuarios = usuari;
      }, error => {
        console.log(error);
      });
  }

  excluirEvento(usuario: Usuario, template: any) {
    this.openModal(template);
    this.usuario = usuario;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${usuario.nome}`;
  }

  confirmeDelete(template: any) {
    this.usuarioService.deleteUsuario(this.usuario.userId).subscribe(
      () => {
        template.hide();
        this.getUsuarios();
      }, error => {
        console.log(error);
      }
    );
  }
}
