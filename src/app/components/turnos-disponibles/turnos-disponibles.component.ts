import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Paciente } from 'src/app/models/paciente';
import { Turno } from 'src/app/models/turno';
import { LoginService } from 'src/app/services/login.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-turnos-disponibles',
  templateUrl: './turnos-disponibles.component.html',
  styleUrls: ['./turnos-disponibles.component.css']
})
export class TurnosDisponiblesComponent implements OnInit {
  turnos: Array<Turno>;
  turno: Turno = new Turno();
  hayTurnos:boolean=true;
  misTurnos: Array<Turno>;
  tengoTurnos:boolean=true;

  constructor(private router: Router, private turnoService: TurnoService, private loginService: LoginService, private pacienteService: PacienteService,private toastr:ToastrService) {
    this.turnos = new Array<Turno>();
    this.misTurnos = new Array<Turno>();
    this.obtenerTurnos();
    this.obtenerMisTurnos();
  }

  ngOnInit(): void {
  }

  esAdmin(){
    if(this.loginService.esAdmin()==true){
      return true;
    }
    return false;
  }

  obtenerTurnos() {
    this.turnoService.getTurnosDisponibles().subscribe(
      result => {
        console.log(result);
        if(result.length==0){
          this.hayTurnos=false;
        }else{
          let unTicket = new Turno();
          result.forEach((element: any) => {
            Object.assign(unTicket, element);
            this.turnos.push(unTicket);
            unTicket = new Turno();
          });
        }
      },
      error => {
        this.toastr.warning(error)
      }
    )
  }

  eliminarTurno(ticket: Turno) {
    this.turnoService.deleteTurno(ticket._id).subscribe(
      result => {
        if (result.status == 1) {
          alert(result.msg);
          window.location.reload();
        }
      },
      error => {
        this.toastr.warning(error)
      }
    )
  }

  modificarTurno(ticket: Turno) {
    this.router.navigate(["turno-form", ticket._id])
  }

  async reservarTurno(turno: Turno) {
    this.turno = turno;

    //console.log("TURNO INICIAL:",this.turno)
    const pacienteString = this.loginService.getUser();
    let paciente = null;

    if (pacienteString !== null) {
      paciente = JSON.parse(pacienteString);
    }

    //console.log("PACIENTE en sesion:",paciente)

    try {
      const result: any = await this.pacienteService.getPacienteDni(paciente.usuario.dni).toPromise();

      const pacienteAgregar = result["0"];

      //console.log("TURNO FINAL:", pacienteAgregar);

      if (pacienteAgregar != null) {
        this.turno.estado = "reservado";
        this.turno.paciente = pacienteAgregar;

        //console.log("TURNO FINAL:", this.turno);

        this.turnoService.editTurno(this.turno).subscribe(
          result => {
            if (result.status == 1) {
              this.toastr.success('Turno reservado correctamente','Turno reservado')

              // if(paciente.rol.descripcion == "paciente"){
              //   this.router.navigate(["/home"])
              // }else{
                this.router.navigate(["/turno"])
              //}

            }
          },
          error => {
            this.toastr.warning(error)
          }
        )
      }

    } catch (error) {
      console.error("Error al obtener los datos del paciente:", error);
      throw error;
    }

  }

  obtenerMisTurnos() {
    this.misTurnos = new Array<Turno>();
    const pacienteString = this.loginService.getUser();
    let paciente = null;

    if (pacienteString !== null) {
      paciente = JSON.parse(pacienteString);
    }

    this.turnoService.getMisTurnos(paciente.usuario.dni).subscribe(
      (result)=>{

        if(result.length==0){
          this.tengoTurnos=false;
        }else{
          let unTurno = new Turno();

          result.forEach((element: any) => {
  
            if (element.paciente != null) {
              Object.assign(unTurno, element);
              this.misTurnos.push(unTurno);
              unTurno = new Turno();
            }
  
          });
        }
        
      }
    )
}

}
