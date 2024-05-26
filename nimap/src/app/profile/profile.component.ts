import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  editMode = false;
  profileForm: FormGroup;
  submitted = false;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z ]*$')]],
      lastName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^\\+[0-9]{1,3}-[0-9]{3,14}$')]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      state: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      tags: [''],
      hobbies: [''],
      subscribeToNewsletter: [false],
      photo: [null]
    });
  }

  ngOnInit() {
    this.userService.getUserProfile().subscribe((data) => {
      this.user = data;
      this.profileForm.patchValue(data);
    });
  }

  get f() { return this.profileForm.controls; }

  onEdit() {
    this.editMode = true;
  }

  onEditPhoto() {
    this.editMode = !this.editMode;
  }
  onCancel() {
    this.editMode = false;
    this.profileForm.patchValue(this.user);
  }

  onSubmit() {
    this.submitted = true;
    if (this.profileForm.valid) {
      this.userService.updateUser(this.user.id, this.profileForm.value).subscribe(() => {
        this.user = { ...this.user, ...this.profileForm.value };
        this.editMode = false;
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileForm.patchValue({ photo: reader.result });
        this.user.photo = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onAgree() {
    alert('You have agreed!');
  }
}
