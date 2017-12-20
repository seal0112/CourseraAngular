import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Comment } from '../shared/comment';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css']
})
export class DishdetailComponent implements OnInit {
  
  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
  feedbackForm: FormGroup;
  comment: Comment;
  errMess: string;

  dishcopy = null;
  formErrors = {
  		'author': '',
  		'comment': ''
  };

  validationMessage = {
  		'author': {
  			'required': 'First Name is required.',
  			'minlength': 'First Name must be at least 2 character long.'
  		},
  		'comment': {
  			'required': 'Last Name is required.'
  		}
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) { 
  		this.createForm();
  }

  ngOnInit() {
  	this.dishservice.getDishIds()
  		.subscribe(dishIds => this.dishIds = dishIds, 
  			errmess => this.errMess = <any>errmess);
    this.route.params
    	.switchMap((params: Params) => this.dishservice.getDish(+params['id']))
    	.subscribe(dish => {this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
        errmess => { this.dish = null; this.errMess = <any>errmess; });
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)] ],
      comment: ['', Validators.required],
      rating: 0,
      date: '',
    });

    this.feedbackForm.valueChanges
    	.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.comment = this.feedbackForm.value;
    let time = new Date();
    this.comment.date = time.toISOString();
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishcopy.save()
      .subscribe(dish => { 
                  this.dish = dish;
                  console.log(this.dish);
                });
    this.feedbackForm.reset({
    	author: '',
    	rating: 5,
    	comment: '',
    });
  }
  
  onValueChanged(data?: any) {
  	if (!this.feedbackForm) {return;}
  	const form = this.feedbackForm;
  	for (const field in this.formErrors) {
  		this.formErrors[field] = '';
  		const control = form.get(field);
  		if (control && control.dirty && !control.valid) {
  			const messages = this.validationMessage[field];
  			for (const key in control.errors) {
  				this.formErrors[field] += messages[key] + ' ';
  			}
  		}
  	}
  }

  setPrevNext(dishId: number) {
  	let index = this.dishIds.indexOf(dishId);
  	this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
  	this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

}
