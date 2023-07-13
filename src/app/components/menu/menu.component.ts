import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { ActivatedRoute, NavigationEnd, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { VigilanteGuard } from 'src/app/vigilante.guard';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{



  logout() {
    this.loginService.logout();
  }
  cont!:number;
  googleCoincidence: boolean = false;
  stickyHeader = false;
  activo: boolean = false;
  execOnce: boolean = false;
  bothLogin:boolean=false;
  isUserVerified!:boolean;
  activeRoute: string = '';
  //NAVBAR
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.stickyHeader = window.scrollY > 0;
  }
  @ViewChild('menuIcon') menuIcon!: ElementRef;
  @ViewChild('navmenu') navmenu!: ElementRef;
  private routerSubscription: Subscription;
  userStatus!:boolean;
  constructor(
    private readonly oAuthService: OAuthService,
    public loginService: LoginService,
    private router: Router,
    private http: HttpClient,
    private esAdmin:VigilanteGuard,
    private activatedRoute:ActivatedRoute
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.resetClasses();
      }
    });
  }
  ngOnInit(): void {
    this.isUserVerified = this.loginService.getUserStatus();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
        console.log(this.activeRoute)
      }
    });
    if(!this.execOnce){
    this.loginGmailLocal();
    }
    //this.googledCheck();
    console.log(this.esLoggedGoogle());
    console.log(this.bothLogin);
    console.log(this.loginService.userLoggedIn())
  }
  public loginGmailLocal(){
    let email = this.loginService.getEmailGoogle()
    console.log(email)
    if(email!=null){
      this.loginService.loginEmailGoogle(email).subscribe(
        result=>{
          this.googleCoincidence=true
          console.log(result)
          if(result.status === 487){
            console.log(result.usuario.dni)
            //guardamos el user en cookies en el cliente
            sessionStorage.setItem("usuario", JSON.stringify(result));
            sessionStorage.setItem("token", result.token);
            sessionStorage.setItem("user", result.username);
            sessionStorage.setItem("userid", result.userid);
            sessionStorage.setItem("userDni",result.usuario.dni);
            sessionStorage.setItem("rol", JSON.stringify(result.rol));
            this.bothLogin = true;
            this.googleCoincidence = true;
            console.log(this.googleCoincidence)
            console.log(this.bothLogin);
            console.log(sessionStorage.getItem("rol"));
            this.execOnce = true;
            if(!this.googleCoincidence){
            window.location.reload();
            }
          }
        },
        error=>{
          this.googleCoincidence = true;
          console.log(error)
          console.log(this.googleCoincidence)
          if(error.status === 487){
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            console.log(error.error.usuario)
            //guardamos el user en cookies en el cliente
            sessionStorage.setItem("usuario", JSON.stringify(error.error.usuario));
            let user = error.error.usuario;
            sessionStorage.setItem("token", user.token);
            sessionStorage.setItem("user", user.username);
            sessionStorage.setItem("userid", user.userid);
            sessionStorage.setItem("userDni", user.dni);
            sessionStorage.setItem("rol", JSON.stringify(user.rol));
            this.bothLogin = true;
            console.log(this.googleCoincidence)
            console.log(this.bothLogin);
            console.log(sessionStorage.getItem("rol"));
            console.log(sessionStorage.getItem("rol"));
            this.execOnce = true;
            console.log(this.execOnce + ' 121231231321')
            if(!this.googleCoincidence){
            window.location.reload();
            }
          }
        }
      )
    }
  }
  esLoggedGoogle(){
    return this.loginService.userLoggedInGoogle();

  }
  esAdministrador(){
    return this.loginService.esAdmin();
  }
  esPaciente(){
    return this.loginService.esPaciente();
  }
  esVisitante(){
    return this.loginService.esVisitante();
  }
  logOutComponent(){
    this.logout()
    this.router.navigate(['/home'])
  }
  logoutGoogle() {
    this.googleCoincidence = false;
    this.execOnce = false;
    this.oAuthService.logOut();
    sessionStorage.clear();
    this.router.navigate(['/home']);
  }
  
  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  toggleMenu() {
    const iconElement = document.querySelector('i');
    const buttonElement = document.querySelector('.navMenu');
    if (iconElement && buttonElement) {
      if (this.activo == false) {
        iconElement.classList.replace('bx-menu', 'bx-x-circle');
        buttonElement.classList.add('open');
        this.activo = true;
      } else {
          iconElement.classList.replace('bx-x-circle', 'bx-menu');
          buttonElement.classList.remove('open');
          this.activo = false;
      }
    }
  }

  bothLogOut() {
    this.googleCoincidence = false;
    this.logout();
    this.execOnce = false;
    console.log("primer logout");
    this.logoutGoogle();
    this.bothLogin = false;
    console.log("Segundo logout");
  }
  resetClasses() {
    const iconElement = document.querySelector('i');
    const buttonElement = document.querySelector('.navMenu');
    if (iconElement && buttonElement) {
      iconElement.classList.replace('bx-x-circle', 'bx-menu');
      buttonElement.classList.remove('open');
    }
  }
}
