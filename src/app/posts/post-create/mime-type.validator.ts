import { AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof control.value === 'string') {
    return of(null as any);
  }

  const file = control.value as File;
  const fileReader = new FileReader();

  const VALID_HEADERS = new Set(["89504e47", "ffd8ffe0", "ffd8ffe1", "ffd8ffe2", "ffd8ffe3", "ffd8ffe8"]);

  const frObs = new Observable<{ [key: string]: any }>((observer) => {
    fileReader.addEventListener("loadend", () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      const header = arr.reduce((acc, byte) => acc + byte.toString(16), "");
      const isValid = VALID_HEADERS.has(header);
      if (isValid) {
        observer.next(null as any);
      } else {
        observer.next({ invalidMimeType: true });
      }
      observer.complete();
    });

    fileReader.addEventListener("error", () => {
      observer.error(fileReader.error);
    });

    fileReader.readAsArrayBuffer(file);
  });
  return frObs;
};