import { Directive, HostListener, ElementRef, Renderer } from '@angular/core';

/**
 * This directive removes focus from the selectors after clicking on them
 * Credit to https://gist.github.com/AlejandroPerezMartin/ecd014cb8104c235b582f3a3e1649cf7
 */
@Directive({
	selector: 'button, a, mat-grid-tile, mat-list, mat-list-item, mat-select' // your selectors here!
})
export class FocusRemover {

	constructor(private elRef: ElementRef, private renderer: Renderer) { }

	@HostListener('click') onClick() {
		this.renderer.invokeElementMethod(this.elRef.nativeElement, 'blur', []);
	}
}