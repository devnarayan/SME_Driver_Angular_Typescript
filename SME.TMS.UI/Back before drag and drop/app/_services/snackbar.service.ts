import { Injectable } from "@angular/core";
import { MdSnackBarRef, SimpleSnackBar, MdSnackBar } from "@angular/material";


@Injectable()
export class SnackbarService {
    private ref: MdSnackBarRef<SimpleSnackBar>;
    private queue: string[];

    constructor(private snackbar: MdSnackBar){
        this.ref = null;
        this.queue = [];
    }

    createSnackbar(message:string){
        this.queue.push(message);
        
        if(this.ref === null){
            this.moveToNextStackbar();
        }
    }

    private moveToNextStackbar(){
        if(this.queue.length > 0){
            const message = this.queue.pop();
            this.ref = this.snackbar.open(message, 'Dismiss', {
                duration: 3000
            });

            this.ref.afterDismissed().subscribe(result => this.moveToNextStackbar());
        }
        else{
            this.ref = null;
        }
    }
}