import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: '/albums/youshengshu', pathMatch: 'full' },
	{
		path: 'album/:albumId',
		loadChildren: () => import('./pages/album/album.module').then(m => m.AlbumModule),
		data: {title: '专辑详情'},
	},
	{
		path: 'book',
		loadChildren: () => import('./pages/book/book.module').then(m => m.BookModule),
	},
	{ path: '**', redirectTo: '/albums/youshengshu' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {
		scrollPositionRestoration: "enabled",
	})],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
