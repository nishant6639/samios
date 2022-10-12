import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoauthGuard } from './guards/noauth.guard';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [NoauthGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule),
    canActivate: [NoauthGuard]
  },
  {
    path: 'provider',
    loadChildren: () => import('./provider/provider.module').then( m => m.ProviderPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'providerdets/:id',
    loadChildren: () => import('./providerdets/providerdets.module').then( m => m.ProviderdetsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'wallet',
    loadChildren: () => import('./wallet/wallet.module').then( m => m.WalletPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then( m => m.FaqPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then( m => m.HelpPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'help/:id',
    loadChildren: () => import('./help/help.module').then( m => m.HelpPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'activity',
    loadChildren: () => import('./activity/activity.module').then( m => m.ActivityPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'editprofile',
    loadChildren: () => import('./editprofile/editprofile.module').then( m => m.EditprofilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dp',
    loadChildren: () => import('./dp/dp.module').then( m => m.DpPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'otp',
    loadChildren: () => import('./otp/otp.module').then( m => m.OtpPageModule)
  },
  {
    path: 'hire/:id',
    loadChildren: () => import('./hire/hire.module').then( m => m.HirePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'bookings',
    loadChildren: () => import('./bookings/bookings.module').then( m => m.BookingsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'members',
    loadChildren: () => import('./members/members.module').then( m => m.MembersPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'addmember',
    loadChildren: () => import('./addmember/addmember.module').then( m => m.AddmemberPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'summary/:id',
    loadChildren: () => import('./summary/summary.module').then( m => m.SummaryPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'memberdets/:id',
    loadChildren: () => import('./memberdets/memberdets.module').then( m => m.MemberdetsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reset',
    loadChildren: () => import('./reset/reset.module').then( m => m.ResetPageModule),
    canActivate: [NoauthGuard]
  },
  {
    path: 'favs',
    loadChildren: () => import('./favs/favs.module').then( m => m.FavsPageModule)
  },
  {
    path: 'forgpw',
    loadChildren: () => import('./forgpw/forgpw.module').then( m => m.ForgpwPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'changepassword',
    loadChildren: () => import('./changepassword/changepassword.module').then( m => m.ChangepasswordPageModule)
  },
  {
    path: 'memberrequests',
    loadChildren: () => import('./memberrequests/memberrequests.module').then( m => m.MemberrequestsPageModule)
  },
  {
    path: 'tnc',
    loadChildren: () => import('./tnc/tnc.module').then( m => m.TncPageModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./privacy/privacy.module').then( m => m.PrivacyPageModule)
  },
  {
    path: 'conf',
    loadChildren: () => import('./conf/conf.module').then( m => m.ConfPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
