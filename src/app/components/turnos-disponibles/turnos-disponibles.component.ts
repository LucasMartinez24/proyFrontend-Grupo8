import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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


  cantidadTurnosCreados: number;

  constructor(
    private router: Router,
    private turnoService: TurnoService,
    private loginService: LoginService,
    private pacienteService: PacienteService
  ) {
    this.turnos = [];
    this.cantidadTurnosCreados = 0;
    this.obtenerTurnos();
  }

  ngOnInit(): void {}

  obtenerTurnos() {
    this.turnoService.getTurnosDisponibles().subscribe(
      result => {
        this.turnos = result;
        this.cantidadTurnosCreados = this.turnos.length;
      },
      error => {
        console.error('Error al obtener los turnos disponibles:', error);
      }
    );
  }

  eliminarTurno(turno: Turno) {
    this.turnoService.deleteTurno(turno._id).subscribe(
      result => {
        if (result.status == 1) {
          alert(result.msg);
          window.location.reload();
        }
      },
      error => {
        alert(error.msg);
      }
    );
  }

  modificarTurno(turno: Turno) {
    this.router.navigate(['turno-form', turno._id]);
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
              alert(result.msg);

              // if(paciente.rol.descripcion == "paciente"){
              //   this.router.navigate(["/home"])
              // }else{
                this.router.navigate(["/turno"])
              //}

            }
          },
          error => {
            alert(error.msg);
          }
        )
      }

    } catch (error) {
      console.error("Error al obtener los datos del paciente:", error);
      throw error;
    }

  }

}
