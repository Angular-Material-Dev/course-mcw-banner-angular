import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerSimpleComponent } from './shared/components/banner-simple/banner-simple.component';
import { BannerAdvancedComponent } from './shared/components/banner-advanced/banner-advanced.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BannerSimpleComponent, BannerAdvancedComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'mcw-banner-angular';
}
