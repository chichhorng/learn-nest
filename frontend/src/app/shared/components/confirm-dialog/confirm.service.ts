import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private confirmSubject = new Subject<boolean>();
  
  readonly isOpen = signal(false);
  readonly options = signal<ConfirmOptions>({ message: '' });

  confirm(options: ConfirmOptions): Promise<boolean> {
    this.options.set({
      title: options.title || 'Confirm Action',
      message: options.message,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      type: options.type || 'info'
    });
    this.isOpen.set(true);
    this.confirmSubject = new Subject<boolean>();
    return new Promise<boolean>((resolve) => {
      this.confirmSubject.subscribe((result) => {
        resolve(result);
      });
    });
  }

  approve() {
    this.isOpen.set(false);
    this.confirmSubject.next(true);
    this.confirmSubject.complete();
  }

  decline() {
    this.isOpen.set(false);
    this.confirmSubject.next(false);
    this.confirmSubject.complete();
  }
}
