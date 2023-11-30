import {
  AfterRenderPhase,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  afterNextRender,
  afterRender,
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
})
export class BannerSimpleComponent implements OnDestroy {
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

  constructor() {
    afterNextRender(
      () => {
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
      },
      { phase: AfterRenderPhase.Write }
    );
  }

  ngOnDestroy(): void {
    this.mdcButtons.forEach((btn) => btn.destroy());
    this.banner?.destroy();
  }

  open() {
    this.banner.open();
  }

  close(reason: CloseReason = CloseReason.UNSPECIFIED) {
    this.banner.close(reason);
  }
}
