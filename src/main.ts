import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { disableDevTools } from '@shared/utils/disable-devtools.util';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    if (!isDevMode()) {
      disableDevTools();
    }
  })
  .catch((err) => console.error(err));
