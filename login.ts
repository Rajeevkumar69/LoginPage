import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Overlay, ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { SelectModulePopupComponent } from '../select-module-popup/select-module-popup.component';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormModel } from 'src/app/shared/models/form.model';
import { GlobalFormValidators } from 'src/app/shared/form-validators/global-form-validators';
declare var $: any;

@Component({
     selector: 'app-login',
     templateUrl: './login.component.html',
     styleUrls: ['./login.component.scss'],
     encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
     public loginForm: FormGroup = new FormGroup({});
     public formModel: FormModel;
     public globalFormValidator: GlobalFormValidators;
     public formErrors: any;
     public validationMessage: any;
     public currentEnvName: string = '';
     public passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$';

     constructor(
          private _toaster: ToastrService,
          private _formBuilder: FormBuilder,
          private _dialog: MatDialog,
          private _overlay: Overlay,
          private _spinner: NgxSpinnerService,
          private _scrollStrategyOptions: ScrollStrategyOptions,
          private _elemRef: ElementRef,
          private _router: Router
     ) {
          this.formModel = new FormModel();
          this.globalFormValidator = new GlobalFormValidators();
     }
     ngOnInit() {
          this.createLoginForm();
     }

     ngAfterViewChecked() {}

     public createLoginForm() {
          this.loginForm = this._formBuilder.group({
               username: new FormControl('', [Validators.required, Validators.email]),
               password: new FormControl('', [Validators.required]),
               recaptcha: new FormControl('', [Validators.required])
          });
          this.loadFormProperty('login');
     }

     public openSelectModulePopup() {
          if (this.loginForm.valid) {
               const enterAnimationDuration: string = '300ms';
               const exitAnimationDuration: string = '300ms';
               this._dialog
                    .open(SelectModulePopupComponent, {
                         enterAnimationDuration,
                         exitAnimationDuration,
                         maxWidth: '100vw',
                         maxHeight: '95vh',
                         panelClass: 'upload-file-dialog-box',
                         disableClose: true,
                         // data: payload,
                         scrollStrategy: this._scrollStrategyOptions.block()
                    })
                    .afterClosed()
                    .subscribe((response) => {});
          } else {
               this.displayAllFormErrors(this.loginForm);
          }
     }

     public resolvedCaptcha(captchaResponse: string) {
          let recaptchaControl = this.loginForm.get('recaptcha');
          if (recaptchaControl) {
               recaptchaControl.setValue(captchaResponse);
          }
     }

     public loadFormProperty(form: string) {
          this.formErrors = this.formModel.formErrors[form];
          this.validationMessage = this.formModel.validationMessage[form];
     }
     public displaySingleFormError(group: FormGroup) {
          this.formErrors = this.globalFormValidator.displaySingleFormError(group, this.formErrors, this.validationMessage);
     }

     public displayAllFormErrors(group: FormGroup) {
          this.formErrors = this.globalFormValidator.displayAllFormErrors(group, this.formErrors, this.validationMessage);
     }
}
