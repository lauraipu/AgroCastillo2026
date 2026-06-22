import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router'; // 👈 IMPORTANTE: Añade 'withHashLocation' aquí
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {
  TranslateHttpLoader,
  TRANSLATE_HTTP_LOADER_CONFIG
} from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 👈 AQUÍ SE ACTIVA EL HASH
    provideRouter(routes, withHashLocation()), 

    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),

    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: '/assets/i18n/',
        suffix: '.json'
      }
    },

    importProvidersFrom(
      TranslateModule.forRoot({
        fallbackLang: 'es',
        loader: {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader
        }
      })
    )
  ]
};