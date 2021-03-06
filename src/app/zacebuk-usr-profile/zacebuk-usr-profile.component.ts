import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { AlertService } from '../_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { FetchJsonDataService } from '../fetch-json-data.service';

@Component({
  selector: 'app-zacebuk-usr-profile',
  templateUrl: './zacebuk-usr-profile.component.html',
  styleUrls: ['./zacebuk-usr-profile.component.css']
})
export class ZacebukUsrProfileComponent implements OnInit, OnDestroy {
  keys = [];
  data = [];
  loading = false;
  user: User;
  picUrl;
  subscription: Subscription;
  userList = [];
  postList = [];
  userNameData = [];
  userEmailData = [];
  userPhoneData = [];
  userGenderData = [];
  userPassData = [];
  userIdData = [];
  currentUserData = [];
  dataUser = [];
  currentUserSubscription: Subscription;
  updateForm: FormGroup;
  commentFlag: any;
  constructor(
    public afAuth: AngularFireAuth, public router: Router, private fb: FormBuilder,
    private alert: AlertService, private afStorage: AngularFireStorage,
    private fetchUser: FetchJsonDataService) {
      this.subscription = this.afAuth.authState.subscribe(user => {
        if (user) {
          this.user = user;
          this.picUrl = this.user.email;
          this.data.push(this.user);
          this.keys = Object.keys(this.user);
          this.currentUserData = JSON.parse(localStorage.getItem('currentUser'));
        } else {
          this.router.navigate(['/app-zacebuk-login']);
        }
      });
  }

  ngOnInit() {
    this.updateForm = this.fb.group({
      photo: ['']
    });
  }

  get fieldValues() {
    return this.updateForm.controls;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updateDetails() {
    console.log('Hello')
    const tempFlag = !this.commentFlag;
    if (tempFlag) {
      document.getElementById('updateDetails').style.display = 'block';
      this.commentFlag = true;
    } else {
      this.commentFlag = false;
      document.getElementById('updateDetails').style.display = 'none';
    }
  }

  onSubmit() {
    this.loading = true;
    const user = this.afAuth.auth.currentUser;
    user.updateProfile({
      photoURL: this.fieldValues.photo.value,
    }).then(() => {
      this.alert.success('Details Updated', true);
    }).catch((error) => {
      this.alert.error(error);
    });
  }

  upload(event) {
    this.afStorage.upload(this.user.email + '.jpg', event.target.files[0])
    .then(() => {
      location.reload();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage  = error.message;
      this.alert.error(errorMessage);
    });
  }
}
