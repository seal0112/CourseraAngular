import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Feedback } from '../shared/feedback';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class FeedbackService {

  constructor(private restangular: Restangular) { }

  submitFeedback(feedback: Feedback) : Observable<Feedback> {
  		console.log(feedback);
  		return this.restangular.all('feedback').post(feedback);
  }
}
