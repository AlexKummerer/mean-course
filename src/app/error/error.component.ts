import { Component, Inject, InjectionToken } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';

export const ERROR_DATA = new InjectionToken<{ message: string }>('ERROR_DATA');


@Component({
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  standalone: true, 
  imports: [ MatButtonModule, MatDialogModule],
})
export class ErrorComponent {
  message = 'An unknown error occurred!';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {

    this.message = data.message;
  }
}
