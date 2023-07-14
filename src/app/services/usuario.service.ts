import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  hostBase: string;

  constructor(private http:HttpClient) {
    this.hostBase = "http://l3.82.255.160:3000/api/usuario/";
   }

  //todos los pacientes
  getUsuarios():Observable<any>{
    let httpOptions={
      headers: new HttpHeaders(
        {

        }
      ),
      params: new HttpParams()

    }

    return this.http.get(this.hostBase,httpOptions);

  }
  //paciente por dni
  getUsuarioDni(dni:string){
    let httpOptions={
      headers: new HttpHeaders(
        {

        }
      ),
      params: new HttpParams()
      .append("dniU",dni)
    }
    return this.http.get(this.hostBase+"dni",httpOptions);
  }
}
