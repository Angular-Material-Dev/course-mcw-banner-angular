import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseReason, MDCBanner } from '@material/banner';
import { MDCRipple } from '@material/ripple';

@Component({
  selector: 'app-banner-simple',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner-simple.component.html',
  styleUrl: './banner-simple.component.scss',
})
export class BannerSimpleComponent implements AfterViewInit, OnDestroy {
  @Input() primaryAction: string = '';
  @Input() secondaryAction: string = '';
  @Input({ required: true }) text!: string;
  @Input() centered: boolean = false;
  @Input() fixed: boolean = false;
  @Input() mobileStacked: boolean = false;

  banner!: MDCBanner;
  @ViewChild('mdcBanner') mdcBanner!: ElementRef<HTMLDivElement>;
  elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
  mdcButtons: MDCRipple[] = [];

  ngAfterViewInit(): void {
    if (this.elementRef) {
      const element =
        this.elementRef.nativeElement.querySelector('.mdc-banner');
      if (element) {
        // 1. Render banner
        this.banner = new MDCBanner(element);

        // 2. Render buttons
        element.querySelectorAll('.mdc-button').forEach((btnEle) => {
          this.mdcButtons.push(new MDCRipple(btnEle));
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.mdcButtons.forEach((btn) => btn.destroy());
    this.banner.destroy();
  }

  open() {
    this.banner.open();
  }

  close(reason: CloseReason = CloseReason.UNSPECIFIED) {
    this.banner.close(reason);
  }
}
