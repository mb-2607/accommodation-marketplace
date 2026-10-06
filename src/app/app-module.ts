import { NgModule, provideBrowserGlobalErrorListeners } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing-module";
import { App } from "./app";
import { Alojamientopagecomponent } from "./components/alojamientopagecomponent/alojamientopagecomponent";

@NgModule({
  declarations: [App, Alojamientopagecomponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
