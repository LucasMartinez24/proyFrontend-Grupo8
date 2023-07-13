import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as printJS from 'print-js';
import { Especialista } from 'src/app/models/especialista';
import { EspecialistaService } from 'src/app/services/especialista.service';
import * as XLSX from 'xlsx';
import * as  ExcelJS from 'exceljs';

@Component({
  selector: 'app-especialista',
  templateUrl: './especialista.component.html',
  styleUrls: ['./especialista.component.css']
})
export class EspecialistaComponent implements OnInit {
  especialistas: Array<Especialista>;
  especialistasDNI: Array<Especialista>;
  dni!: string;
  constructor(private especialistaService: EspecialistaService, private router: Router, private toastr: ToastrService) {
    this.especialistas = new Array<Especialista>();
    this.especialistasDNI = new Array<Especialista>();
    this.obtenerEspecialistas();
  }

  ngOnInit(): void {
  }
  obtenerEspecialistas() {
    this.especialistaService.getEspecialistas().subscribe(
      result => {
        let e = new Especialista();
        result.forEach((element: any) => {
          Object.assign(e, element);
          this.especialistas.push(e);
          e = new Especialista();
        });
      },
      error => {
        console.log(error);
      }
    )
  }


  obtenerEspecialistaPorDNI() {
    console.log("ENTRANDO A especialista POR DNI");
    this.especialistas = new Array<Especialista>();
    this.especialistaService.getEspecialistaPorDNI(this.dni).subscribe(
      (result: any) => {
        this.especialistasDNI = result;
        let e = new Especialista();
        result.forEach((element: any) => {
          Object.assign(e, element);
          this.especialistas.push(e);
          e = new Especialista();
        });
        console.log("SALIENDO  DE   especialista POR DNI");
      },
      error => {
        this.toastr.warning('Error al buscar especialista por dni', 'Error')
      }
    )
  }

  eliminarEspecialista(e: Especialista) {
    this.especialistaService.deleteEspecialista(e._id).subscribe(
      result => {
        if (result.status == 1) {
          this.toastr.warning('Especialista eliminado correctamente', 'Especialista Eliminado')
          window.location.reload();
        }
      },
      error => {
        alert(error.msg);
      }
    )
  }

  modificarEspecialista(e: Especialista) {
    this.router.navigate(["especialista-form", e._id])
  }

  agregarEspecialista() {
    this.router.navigate(["especialista-form", 0])
  }

  imprimirPdf() {
    printJS({
      printable: this.especialistas,
      properties: [
        { field: 'nombre', displayName: 'Nombre' },
        { field: 'apellido', displayName: 'Apellido' },
        { field: 'profesion', displayName: 'Profesión/Cargo' },
        { field: 'dni', displayName: 'DNI' }
      ],
      type: 'json',
      header: `<h2 class="print-header">Especialistas Registrados</h2> <hr/>`,
      style: `
      .print-header{
        text-align: center;
        color:withe;
        font-weight: bold;
        background-color:lightblue;
        padding: 10px 0;
        margin:0;
      }
      table{
        width:100%;
        text-align: center;
      }
      th, td{
        padding:8px;
      }
      th{
        background-color:lightgray;
        color:white;
      }` ,
    })
  }

  imprimirXlsx(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.especialistas)//definimos hojas de trabajo y le asignamos los pacientes
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Especialistas Registrados`) //nombre de la hoja de excel
    XLSX.writeFile(workbook, `ListadoEspecialistas.xlsx`);

  }

  generarExcel(especialista: Especialista) {
    console.log('entrando a generar excel')
    const workbook = new ExcelJS.Workbook(); //creamos una nueva hojja 
    const create = workbook.creator = ('Centro de Salud Huaicos') //agregamos el autor del excel
    const worksheet = workbook.addWorksheet('Listado de Especialistas') //nombre del excel

    //agregar datos al archivo de excel
    worksheet.addRow(['DNI', 'Nombre', 'Apellido', 'Profesión']);
    worksheet.addRow([especialista.dni, especialista.nombre, especialista.apellido, especialista.profesion]);
  }
}
