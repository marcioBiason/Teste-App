import { Observable } from 'rxjs';
import { Usuario } from './../models/Usuario';
import { UsuarioService } from './../services/usuario.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { templateJitUrl } from '@angular/compiler';
import { DatePipe } from '@angular/common';

defineLocale('pt-br', ptBrLocale);

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
  nomeFiltro: string;

  options = [
    { name: 'Ativo', value: 1 },
    { name: 'Inativo', value: 2 }
  ];
  sexos = [
    { descricao: 'Feminino' },
    { descricao: 'Masculino' }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localService: BsLocaleService
  ) {
    this.localService.use('pt-br');
  }

  editarUsuario(usuario: Usuario, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.usuario = Object.assign({}, usuario);
    this.usuario = usuario;
    this.registerForm.patchValue(this.usuario);
  }

  filtrarPorNome(nome: string) {
    this.usuarioService.getUsuariosFiltro(nome).subscribe(
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

  validacao() {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      dataNascimento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      sexo: ['', Validators.required]
    });
  }

  salvar(template: any) {
    if (this.registerForm.valid) {
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
        this.usuario = Object.assign({ userId: this.usuario.userId }, this.registerForm.value);
        this.usuarioService.putUsuario(this.usuario).subscribe(
          () => {
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
