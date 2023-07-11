import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Paciente } from 'src/app/models/paciente';
import { PacienteService } from 'src/app/services/paciente.service';
import * as printJS from 'print-js'; //print en pdf
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
  paciente!: Paciente;
  pacientes:Array<Paciente>;
  pacienteDni:Array<Paciente>;
  dni!:string;
  dato!: string;
  apellido!: string;
  pacienteNyA:Array<Paciente>;
  constructor(private pacienteService: PacienteService, private activatedRoute: ActivatedRoute,
    private router: Router, private toastr:ToastrService) {
      this.dato= "";
      this.pacientes = new Array<Paciente>();
      this.pacienteDni= new Array<Paciente>();
      this.pacienteNyA = new Array<Paciente>();
      this.paciente = new Paciente();
      this.obtenerPacientes();
    }

  ngOnInit(): void {
  }


  obtenerPacientes(){
    console.log("entrando a obtener pacientes")
    this.pacienteService.getPacientes().subscribe(
      result=>{
        let unPaciente = new Paciente();
        result.forEach((element:any) => {
          Object.assign(unPaciente,element);
          this.pacientes.push(unPaciente);
          unPaciente = new Paciente();
        });
      },
      error=>{
        console.log(error);
      }
    )
  }


  obtenerPacienteDni(){
    console.log("ENTRANDO A PACIENTE POR DNI");
    this.pacientes=new Array<Paciente>();
    this.pacienteService.getPacienteDni(this.dni).subscribe(
      result=>{
        this.pacienteDni=result;
        let unPaciente = new Paciente();
        result.forEach((element:any) => {
          Object.assign(unPaciente,element);
          this.pacientes.push(unPaciente);
          unPaciente = new Paciente();
        });
      },
      error=>{
        alert(error);
      }
    )
  }

  eliminarPaciente(paciente:Paciente){
    this.pacienteService.deletePaciente(paciente._id).subscribe(
      result=>{
        if(result.status == 1){
          this.toastr.warning('Paciente eliminado correctamente','Paciente Eliminado')
          window.location.reload();
        }
      },
      error=>{
        alert(error.msg);
      }
    )
  }

  modificarPaciente(paciente:Paciente){
    console.log(paciente);
    this.router.navigate(["paciente-form",paciente._id])
  }

  agregarPaciente(){
    this.router.navigate(["paciente-form",0])
  }
  verControl(paciente:Paciente){
    this.router.navigate(['datosMedicosHome',paciente._id])
  }

  imprimirPdf(){
    printJS({
      printable: this.pacientes, 
      properties: [
        {field:'dni',displayName:'DNI'},
        {field:'nombre',displayName:'Nombre'},
        {field:'apellido',displayName:'Apellido'},
        {field:'fechaNac',displayName:'Fecha de Nacimiento'}
      ], 
      type: 'json',
      header:`<h2 class="print-header">Pacientes Registrados</h2> <hr/>`,
      style:`
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
 
  imprimirXlsx():void{
    const worksheet= XLSX.utils.json_to_sheet(this.pacientes)//definimos hojas de trabajo y le asignamos los pacientes
    const workbook =XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Pacientes Registrados`) //nombre de la hoja de excel
    XLSX.writeFile(workbook, `ListaPacientes.xlsx`);
    
    }


    obtenerPacienteNA(){
      this.pacientes = new Array<Paciente>();
      this.pacienteService.getPacienteNA(this.dato).subscribe(
    result => {
      console.log(result);
      this.pacienteNyA = result;
      let unPaciente = new Paciente();
      this.pacientes = new Array<Paciente>();
      result.forEach((element:any) => {
        Object.assign(unPaciente,element);
        this.pacientes.push(unPaciente);
        unPaciente = new Paciente();
      });
    },
    error => {
      console.log(error);
    }
  )

    }
}

