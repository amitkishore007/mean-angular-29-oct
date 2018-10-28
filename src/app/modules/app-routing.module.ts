import { RouterModule } from '@angular/router';
import { PostCreateComponent } from './../components/posts/post-create/post-create.component';
import { PostListComponent } from './../components/posts/post-list/post-list.component';
import { Routes } from '@angular/router';
import { NgModule } from "@angular/core";

const appRoutes: Routes = [
    {path:'', component:PostListComponent},
    {path:'create',component:PostCreateComponent},
    {path:'edit/:id', component:PostCreateComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule{

}