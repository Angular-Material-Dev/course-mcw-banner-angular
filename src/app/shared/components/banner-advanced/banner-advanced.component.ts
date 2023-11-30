import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostBinding,
  afterRender,
  OnDestroy,
  AfterRenderPhase,
  afterNextRender,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  MDCBanner,
  CloseReason,
  MDCBannerAdapter,
  MDCBannerFoundation,
} from '@material/banner';
import { MDCRipple } from '@material/ripple';
import { A11yModule, FocusMonitor } from '@angular/cdk/a11y';

export const classNames = (classList: string[]) =>
  classList.filter(Boolean).join(' ');

@Component({
  selector: 'app-banner-advanced',
  standalone: true,
  imports: [CommonModule, A11yModule],
  templateUrl: './banner-advanced.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerAdvancedComponent implements OnDestroy {
  @Input() primaryAction = '';
  @Input() secondaryAction = '';
  @Input({ required: true }) text!: string;
  @Input() centered = false;
  @Input() fixed = false;
  @Input() mobileStacked = false;
  @Input() icon = '';
  @Input() autoClose = true;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';

  banner!: MDCBanner;
  @ViewChild('mdcBannerContent') mdcBannerContent!: ElementRef<HTMLDivElement>;
  @ViewChild('primaryActionEl') primaryActionEl!: ElementRef<HTMLDivElement>;
  elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
  mdcButtons: MDCRipple[] = [];
  private _document = inject(DOCUMENT);

  private _foundation!: MDCBannerFoundation;
  classList = new Set<string>();
  style = {};
  focusMonitor = inject(FocusMonitor);
  cdr = inject(ChangeDetectorRef);
  triggerSelector: string | undefined;

  get classes() {
    return classNames([
      'mdc-banner',
      ...Array.from(this.classList),
      this.centered ? 'mdc-banner--centered' : '',
      this.mobileStacked ? 'mdc-banner--mobile-stacked' : '',
    ]);
  }

  constructor() {
    this.cdr.detach();
    afterNextRender(
      () => {
        if (this.elementRef) {
          this._foundation = new MDCBannerFoundation(this.adapter);
          this._foundation.init();
        }
      },
      { phase: AfterRenderPhase.Write }
    );
  }

  @HostBinding('class.color-accent') get accentColor() {
    return this.color === 'accent';
  }

  @HostBinding('class.color-warn') get warnColor() {
    return this.color === 'warn';
  }

  setStyle = (varName: string, value: string) => {
    const updatedStyle: { [key: string]: string } = Object.assign(
      {},
      this.style
    );
    updatedStyle[varName] = value;
    this.style = updatedStyle;
    this.cdr.detectChanges();
  };

  getContentHeight = () => {
    return this.mdcBannerContent.nativeElement.offsetHeight;
  };

  get adapter(): MDCBannerAdapter {
    return {
      addClass: (className) => {
        this.classList.add(className);
        this.cdr.detectChanges();
      },
      getContentHeight: this.getContentHeight,
      notifyClosed: () => undefined,
      notifyClosing: () => undefined,
      notifyOpened: () => undefined,
      notifyActionClicked: () => undefined,
      notifyOpening: () => undefined,
      releaseFocus: () => {
        const ele =
          this.triggerSelector &&
          (this._document.querySelector(this.triggerSelector) as HTMLElement);
        if (ele) {
          this.focusMonitor.focusVia(ele, 'program');
        }
        this.triggerSelector = undefined;
      },
      removeClass: (className) => {
        this.classList.delete(className);
        this.cdr.detectChanges();
      },
      setStyleProperty: this.setStyle,
      trapFocus: () => {
        // Trapping is taken care by cdkTrapFocus directive
        // We just need to focus on primary btn
        this.focusMonitor.focusVia(
          this.primaryActionEl.nativeElement,
          'program'
        );
      },
    };
  }

  // ngAfterViewInit(): void {
  //   if (this.elementRef) {
  //     this._foundation = new MDCBannerFoundation(this.adapter);
  //     this._foundation.init();
  //   }
  // }

  ngOnDestroy(): void {
    this._foundation?.destroy();
  }

  open(triggerSelector?: string) {
    this._foundation.open();
    this.triggerSelector = triggerSelector;
  }

  close(reason: CloseReason = CloseReason.UNSPECIFIED) {
    this._foundation.close(reason);
  }

  handlePrimaryActionClick() {
    this._foundation.handlePrimaryActionClick(!this.autoClose);
  }

  handleSecondaryActionClick() {
    this._foundation.handleSecondaryActionClick(!this.autoClose);
  }
}
