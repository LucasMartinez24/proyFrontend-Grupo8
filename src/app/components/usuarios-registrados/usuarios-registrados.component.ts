import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as printJS from 'print-js';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-usuarios-registrados',
  templateUrl: './usuarios-registrados.component.html',
  styleUrls: ['./usuarios-registrados.component.css']
})
export class UsuariosRegistradosComponent {

  
  usuarios: Array<Usuario>;
  usuarioDni: Array<Usuario>;
  dni!: string;
  //dtOptions : DataTables.Settings = {}; 
  //dtTrigger =new Subject<any>();

  constructor(private usuarioService: UsuarioService, private activatedRoute: ActivatedRoute,
    private router: Router, private toastr: ToastrService) {
    this.usuarios = new Array<Usuario>();
    this.usuarioDni = new Array<Usuario>();
    this.obtenerUsuarios();
  }

  ngOnInit(): void {
    /*this.dtOptions={
      pagingType :'full_pages',
      pageLength: 5,
    },
    this.obtenerPacientes();*/
  }

  /*ngOnDestroy():void{
     this.dtTrigger.unsubscribe();
 }*/

  imprimirPdf() {
    printJS({
      printable: this.usuarios,
      properties: [
        { field: 'username', displayName: 'USUARIO' },
        { field: 'email', displayName: 'E-MAIL' },
        { field: 'rol', displayName: 'ROL' },
        { field: 'dni', displayName: 'DNI' }
      ],
      type: 'json',
      header: `<h2 class="print-header">Pacientes Registrados</h2> <hr/>`,
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
  imprimirXlsx():void{
    const worksheet= XLSX.utils.json_to_sheet(this.usuarios)//definimos hojas de trabajo y le asignamos los pacientes
    const workbook =XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Usuarios Registrados`) //nombre de la hoja de excel
    XLSX.writeFile(workbook, `ListaUsuariosRegistrados.xlsx`);

  }

  obtenerUsuarios() {
    console.log("entrando a obtener pacientes")
    this.usuarioService.getUsuarios().subscribe(
      result => {
        let unUsuario = new Usuario();
        result.forEach((element: any) => {
          Object.assign(unUsuario, element);
          this.usuarios.push(unUsuario);
          unUsuario = new Usuario();
        });
      },
      error => {
        console.log(error);
      }
    )
  }


  obtenerUsuarioDni() {
    console.log("ENTRANDO A PACIENTE POR DNI");
    this.usuarios = new Array<Usuario>();
    this.usuarioService.getUsuarioDni(this.dni).subscribe(
      (result: any) => {
        this.usuarioDni = result;

        let unUsuario = new Usuario();
        result.forEach((element: any) => {
          Object.assign(unUsuario, element);
          this.usuarios.push(unUsuario);
          unUsuario = new Usuario();
        });
      },
      error => {
        this.toastr.warning('Error al buscar paciente por dni', 'Error')
      }
    )
  }


}