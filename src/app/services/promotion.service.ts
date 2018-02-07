import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Promotion } from '../shared/promotion'; 
import { PROMOTIONS } from '../shared/promotions';

import { Http, Response } from '@angular/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';
import { RestangularModule, Restangular } from 'ngx-restangular';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';

@Injectable()
export class PromotionService {

  constructor(private restangular: Restangular,
              private processHTTPMsgService: ProcessHttpmsgService) { }

  getPromotions(): Observable<Promotion[]> {
    return this.restangular.all('promotions').getList();
  }

  getPromotion(id: number): Observable<Promotion> {
  	return this.restangular.one('promotions',id).get();
  }

  getFeaturedPromotion(): Observable<Promotion> {
  	return this.restangular.all('promotions').getList({featured: true})
                  .map(dishes => dishes[0]);
  }

}
