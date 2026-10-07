import { NgModule, provideBrowserGlobalErrorListeners } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing-module";
import { App } from "./app";
import { Alojamientopagecomponent } from "./components/alojamientopagecomponent/alojamientopagecomponent";
import { Iniciocomponent} from "./components/iniciocomponent/iniciocomponent";
import { Navbarcomponent} from "./components/navbarcomponent/navbarcomponent";
import { Mapacomponent} from "./components/mapacomponent/mapacomponent";
import { Footercomponent} from "./components/footercomponent/footercomponent";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [App, Alojamientopagecomponent, Iniciocomponent, Navbarcomponent, Mapacomponent, Footercomponent],
    imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
