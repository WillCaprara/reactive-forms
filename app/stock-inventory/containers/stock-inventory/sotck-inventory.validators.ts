import { AbstractControl } from "@angular/forms";

export class StockValidators {
    static checkBranch(control: AbstractControl) {
        const regexp = /^[a-z]\d{3}$/i;
        const valid = regexp.test(control.value);
        return valid? null: { invalidBranch: true };
    }    

    static checkStockExists(control: AbstractControl) {
        //Stock item is the FormArray.
        const stockItem = control.get('stock');
        const selector = control.get('selector');

        //If these controls don't exist...
        if(!(stockItem && selector)) {
            return null;
        }

        //To see either they do exist or not, we are going to do a quick check:
        //Because stockItem is an array (FormArray) we can use -> .some -> Is similar to the regular expression test that we have above, in thefact that it returns a boolean however this is an array method.
        const exists = stockItem.value.some((stock) => {
            //When we interact with our form and select an item from the dropdown, this is what the selector.value will correspond to and the .product_id will be the product that we have just selected.
            //What we are doing is we're iterating the array of products that we've added and checking wether the product_id equals the one that we just selected.
            //parseInt -> Because it's coming from a DOM select menu, it will be a string so we'll parse it to int.
            return stock.product_id === parseInt(selector.value.product_id);
        });

        return exists? { stockExists: true } : null;
    }
}