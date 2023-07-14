import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Especialista } from '../models/especialista';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {
  hostBase: string;

  constructor(private http:HttpClient) {
    this.hostBase = "http://localhost:3000/api/especialista/";
  }
/*
  constructor(private http: HttpClient) {
    this.hostBase = "http://3.82.255.160:3000/api/especialista/";
  }*/

  getEspecialistas(): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
      })
    }
    return this.http.get(this.hostBase, httpOption)
  }
  getEspecialista(id: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders(
        {

        }
      ),
      params: new HttpParams()

    }

    return this.http.get(this.hostBase + id, httpOptions);
  }

  //paciente por NyA
  getEspecialistaNA(nombre:string, apellido:string){
    let httpOptions={
      headers: new HttpHeaders(
        {

        }
      ),
      params: new HttpParams()
      .append("nombrE",nombre)
      .append("apellidoE",apellido)
    }
    return this.http.get(this.hostBase+'busquedaEspecialista',httpOptions);
  }

  createEspecialista(e: Especialista): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders(
        {
          "Content-type": "application/json"
        }
      ),
      params: new HttpParams()
    }

    let body = JSON.stringify(e);

    return this.http.post(this.hostBase, body, httpOptions);
  }

  deleteEspecialista(id: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders(
        {

        }
      ),
      params: new HttpParams()
    }

    return this.http.delete(this.hostBase + id, httpOptions);
  }

  editEspecialista(e: Especialista): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders(
        {
          "Content-type": "application/json"
        }
      ),
      params: new HttpParams()
    }

    let body = JSON.stringify(e);

    return this.http.put(this.hostBase + e._id, body, httpOptions);
  }

  getEspecialistaPorDNI(dni: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders(
        {

        }
      ),
      params: new HttpParams()
        .append("dniP", dni)
    }

    return this.http.get(this.hostBase+"dniEspecialista", httpOptions);
  }

}
