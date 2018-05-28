import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

import { DashboardComponent } from './ui/dashboard/dashboard.component';
import { PageNotFoundComponent } from './ui/not-found.component';
import { UserLoginComponent } from './ui/user-login/user-login.component';
import { UserProfileComponent } from './ui/user-profile/user-profile.component';

import { ClientsListComponent } from './clients/clients-list/clients-list.component';
import { ClientFormComponent } from './clients/client-form/client-form.component';
import { ClientDetailComponent } from './clients/client-detail/client-detail.component';
import { ClientSearchComponent } from './clients/client-search/client-search.component';

import { MembersListComponent } from './members/members-list/members-list.component';
import { MemberFormComponent } from './members/member-form/member-form.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { SalonComponent } from './members/salon/salon.component';

import { PrestationListComponent } from './prestations/prestation-list/prestation-list.component';
import { PrestationFormComponent } from './prestations/prestation-form/prestation-form.component';
import { PrestationDetailComponent } from './prestations/prestation-detail/prestation-detail.component';

import { ProductsListComponent } from './products/products-list/products-list.component';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';

import { ForfaitListComponent } from './forfaits/forfait-list/forfait-list.component';
import { ForfaitFormComponent } from './forfaits/forfait-form/forfait-form.component';
import { ForfaitDetailComponent } from './forfaits/forfait-detail/forfait-detail.component';

import { CartFormComponent } from './cart/cart-form/cart-form.component';
import { CartListComponent } from './cart/cart-list/cart-list.component';
import { CartDetailComponent } from './cart/cart-detail/cart-detail.component';

import { FacturationListComponent } from './facturation/facturation-list/facturation-list.component';
import { FacturationFormComponent } from './facturation/facturation-form/facturation-form.component';
import { FacturationDetailComponent } from './facturation/facturation-detail/facturation-detail.component';
import { FacturationEventComponent } from './facturation/facturation-event/facturation-event.component';
import { FacturationCartComponent } from './facturation/facturation-cart/facturation-cart.component';
import { PrintBillComponent } from './facturation/print-bill/print-bill.component';

import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { EventFormComponent } from './events/event-form/event-form.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { EventsDayviewComponent } from './events/events-dayview/events-dayview.component';

import { TodoComponent } from './admin/todo/todo.component';
// import { DayViewComponent } from './calendar/day-view/day-view.component';
// import { SalonsComponent } from './salons/salons.component';
import { CoreModule } from './core/core.module'

const routes: Routes = [
  // { path: '', redirectTo: 'login',pathMatch: 'full'},
  { path: 'todo', component: TodoComponent, canActivate: [AuthGuard] },  
  ////////////////////////////////////////////////////////////////
  { path: 'calendar', component: EventsDayviewComponent },
  { path: 'events', component: EventListComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'eventform', component: EventFormComponent },
  ////////////////////////////////////////////////////////////////
  { path: 'prestations', component: PrestationListComponent },
  { path: 'prestationform', component: PrestationFormComponent },
  { path: 'prestation/:id', component: PrestationDetailComponent },
  ////////////////////////////////////////////////////////////////
  { path: 'products', component: ProductsListComponent },
  { path: 'productform', component: ProductFormComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  ////////////////////////////////////////////////////////////////  
  { path: 'forfaits', component: ForfaitListComponent },
  { path: 'forfaitform', component: ForfaitFormComponent },
  { path: 'forfait/:id', component: ForfaitDetailComponent },  
  ////////////////////////////////////////////////////////////////
  { path: 'carts', component: CartListComponent },
  { path: 'cart/:id', component: CartDetailComponent },
  { path: 'cartform', component: CartFormComponent },
  ////////////////////////////////////////////////////////////////
  { path: 'bills', component: FacturationListComponent },
  { path: 'facturationform', component: FacturationFormComponent },
  { path: 'facturationevent/:eventid', component: FacturationEventComponent },
  { path: 'facturationcart/:cartid', component: FacturationCartComponent },
  { path: 'facturation/:id', component: FacturationDetailComponent },
  { path: 'printbill/:id', component: PrintBillComponent }, 
  ////////////////////////////////////////////////////////////////
  { path: 'salon', component: SalonComponent },
  { path: 'members', component: MembersListComponent },
  { path: 'memberform', component: MemberFormComponent },  
  { path: 'member/:id', component: MemberDetailComponent },  
  ////////////////////////////////////////////////////////////////
  { path: 'clients', component: ClientsListComponent },
  { path: 'clientform', component: ClientFormComponent },  
  { path: 'clientsearch', component: ClientSearchComponent },  
  { path: 'client/:id', component: ClientDetailComponent },  
  ////////////////////////////////////////////////////////////////
  { path: 'dashboard', component: DashboardComponent},
  { path: 'profile', component: UserProfileComponent},  
  { path: 'login', component: UserLoginComponent},
  { path: '', component: UserLoginComponent },
  { path: '**', component: PageNotFoundComponent },
  ////////////////////////////////////////////////////////////////
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers: [
    AuthGuard
  ]
})
export class AppRoutingModule {}
