import {Injectable} from '@angular/core';
import {DialogPosition, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {ComponentType} from '@angular/cdk/portal';

export interface SideDialogDefaultConfig {
  width: string;
  height: string;
  panelClass: string;
  position: DialogPosition;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  protected defaultConfig: SideDialogDefaultConfig = {
    width: '75%',
    height: '100vh',
    panelClass: 'side-dialog',
    position: {
      right: '0',
      top: '0',
    },
  };

  constructor(private readonly dialogService: MatDialog) {
  }

  public open<T, D, R>(componentClass: ComponentType<T>, config?: MatDialogConfig<D>): MatDialogRef<T, R> {
    const dialogRef = this.dialogService.open<T, D, R>(componentClass, {
      ...this.defaultConfig,
      ...config,
    });

    return dialogRef;
  }
}
