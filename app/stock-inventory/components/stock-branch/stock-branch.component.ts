import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
    selector: 'stock-branch',
    styleUrls: ['stock-branch.component.scss'],
    templateUrl: 'stock-branch.component.html'
})
export class StockBranchComponent {
    @Input()
    parent: FormGroup;

    get invalid() {
        return (
            this.parent.get('store.branch').hasError('invalidBranch') &&
            //dirty -> to show the error if the user has actually interacted with the field (meaning they made an attempt of typing rather than just focusing/blurring)
            this.parent.get('store.branch').dirty &&
            //Only show the error only when the field has been filled in (user has actually inputed something)
            !this.required('branch')
        );
    }
    get unknown() {
        return (
            this.parent.get('store.branch').hasError('unknownBranch') &&
            this.parent.get('store.branch').dirty
        );
    }

    required(name: string) {
        return (
            this.parent.get(`store.${name}`).hasError('required') &&
            this.parent.get(`store.${name}`).touched
        );
    }
}