import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  console.log(control.value);

  if (typeof control.value === 'string') {
    return of(null as unknown as { [key: string]: any });
  }

  const file = control.value as File;
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const fileReader = new FileReader();

  const VALID_HEADERS = new Set(["89504e47", "ffd8ffe0", "ffd8ffe1", "ffd8ffe2", "ffd8ffe3", "ffd8ffe8"]);

  const frObs = new Observable<{ [key: string]: any }>((observer) => {
    fileReader.addEventListener("loadend", () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = "";
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      const isValid = VALID_HEADERS.has(header);
      if (isValid) {
        observer.next(null as unknown as { [key: string]: any });
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
