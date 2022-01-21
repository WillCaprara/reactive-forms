import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Product } from "../../models/product.interface";

@Component({
    selector: 'stock-selector',
    styleUrls: ['stock-selector.component.scss'],
    templateUrl: 'stock-selector.component.html'
})
export class StockSelectorComponent {
    @Input()
    parent: FormGroup;

    @Input()
    products: Product[];

    @Output()
    added = new EventEmitter<any>();

    get stockExists() {
        return (
            this.parent.hasError('stockExists') &&
            this.parent.get('selector.product_id').dirty
        );
    }

    get notSelected() {
        return (
            !this.parent.get('selector.product_id').value
        )
    }

    onAdd() {
        this.added.emit(this.parent.get('selector').value);
        this.parent.get('selector').reset({
            product_id: '',
            quantity: 10
        });
    }
}