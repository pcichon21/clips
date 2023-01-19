import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(
    private auth: AuthService,
    private emailTaken: EmailTaken
  ) { }

  inSubmission = false

  name = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  email = new UntypedFormControl('', [
    Validators.required,
    Validators.email
  ], [this.emailTaken.validate])
  age = new UntypedFormControl('', [
    Validators.required,
    Validators.min(12),
    Validators.max(120)
  ])
  password = new UntypedFormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ])
  // - at least 8 characters
  // - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
  // - Can contain special characters
  confirm_password = new UntypedFormControl('', [
    Validators.required
  ])
  phoneNumber = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13)
  ])

  showAlert = false
  alertMsg = 'Please wait! Your account is being created.'
  alertColor = 'blue'

  registerForm = new UntypedFormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match('password', 'confirm_password')])

  async register() {
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Your account is being created.'
    this.inSubmission = true

    try {
      await this.auth.createUser(this.registerForm.value as IUser)
    } catch (e) {
      this.alertColor = 'red'
      this.alertMsg = 'An unexpected error occured!. Please try again later'
      this.inSubmission = false
      console.log(e)
      return
    }
    this.alertColor = 'green'
    this.alertMsg = 'Success! Your account has been created.'
  }
}
