import { Injectable } from '@angular/core';
import {FormControl } from '@angular/forms';
import { StockManagementService } from '../services/stock-management.service';

@Injectable({
  providedIn: 'root'
})
export class cekBarang {
    

    static isValid(control: FormControl): any {
        
        if(control.value == "kontol"){
            return {
                "not a number": true
            };
        }
        return null;
        
    }
}
