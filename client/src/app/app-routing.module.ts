import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { statusCheckerGuard } from './guards/status-checker.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [statusCheckerGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    canActivate: [adminGuard],
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
