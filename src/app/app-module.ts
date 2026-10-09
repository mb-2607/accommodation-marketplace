import { NgModule, provideBrowserGlobalErrorListeners } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing-module";
import { App } from "./app";
import { Alojamientopagecomponent } from "./components/alojamientopagecomponent/alojamientopagecomponent";
import { Iniciocomponent } from "./components/iniciocomponent/iniciocomponent";
import { Navbarcomponent } from "./components/navbarcomponent/navbarcomponent";
import { Mapacomponent } from "./components/mapacomponent/mapacomponent";
import { Footercomponent } from "./components/footercomponent/footercomponent";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Cotizacioncomponent } from "./components/cotizacioncomponent/cotizacioncomponent";
import { Logincomponent } from "./components/loggincomponent/loggincomponent";
import { provideHttpClient } from "@angular/common/http";
import { Filtercomponent } from "./components/filtercomponent/filtercomponent";
import { Confirmarreservacomponent } from "./components/confirmarreservacomponent/confirmarreservacomponent";

@NgModule({
  declarations: [
    App,
    Alojamientopagecomponent,
    Iniciocomponent,
    Navbarcomponent,
    Mapacomponent,
    Footercomponent,
    Cotizacioncomponent,
    Logincomponent,
    Filtercomponent,
    Confirmarreservacomponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
