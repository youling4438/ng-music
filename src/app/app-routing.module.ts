import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: '/albums/youshengshu', pathMatch: 'full' },
	{
		path: 'album/:albumId',
		loadChildren: () => import('./pages/album/album.module').then(m => m.AlbumModule),
	},
	{ path: '**', redirectTo: '/albums/youshengshu' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
