import { Component, OnInit} from '@angular/core';
import { ProductToasterService } from '../../../../core/services/toaster.service';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
    selector: 'app-product-header',
    templateUrl: 'product-header.component.html'
})

export class ProductHeaderComponent implements OnInit {
   constructor(
      private storageService: StorageService,
      private toastrService: ProductToasterService ) {  }

    ngOnInit() {
    }
}
