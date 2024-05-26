import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^\\+[0-9]{1,3}-[0-9]{3,14}$')]],
      age: [18, [Validators.required, Validators.min(18), Validators.max(100)]],
      state: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      tags: ['', Validators.required],
      subscribeToNewsletter: [false],
      photo: ['']
    });
  }

  get f() { return this.registrationForm.controls; }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.registrationForm.patchValue({ photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }


  onSubmit() {
    this.submitted = true;
    if (this.registrationForm.valid) {
      this.userService.registerUser(this.registrationForm.value).subscribe(() => {
        this.router.navigate(['/profile']);
      });
    }
  }
}
