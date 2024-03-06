import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/modules/shared.module";

@NgModule({
    declarations: [AuthComponent],
    imports: [
        SharedModule,
        RouterModule.forChild([{ path: 'auth', component: AuthComponent }])
    ]
})
export class AuthModule { }