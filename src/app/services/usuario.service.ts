import { Usuario } from './../models/Usuario';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  baseUrl = 'http://localhost:5000/v1/Usuario';
  private headers: HttpHeaders;
  private option: object;

  constructor(
    private http: HttpClient,
  ) {
    this.headers = new HttpHeaders({
      //'Content-Type' : 'application/x-www-form-urlencoded'
    });
    this.option = { headers: this.headers };
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }
  getUsuariosAtivos(ativo: boolean): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/GetUsuariosAtivos/${ativo}`);
  }
  postUsuario(usuario: Usuario) {
    return this.http.post(this.baseUrl, usuario, this.option);
  }
  putUsuario(usuario: Usuario) {
    return this.http.put(`${this.baseUrl}/GetById/${usuario.userId}`, usuario);
  }
  deleteUsuario(id: number) {
    return this.http.delete(`${this.baseUrl}/?id=${id}`);
  }
}
