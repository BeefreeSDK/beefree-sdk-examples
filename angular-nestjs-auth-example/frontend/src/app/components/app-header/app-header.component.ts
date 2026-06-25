import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header>
      <div class="left-side">
        <img src="/images/logo.svg" height="40" alt="Beefree SDK" />
      </div>
      <div class="right-side">
        <div class="angular-brand">
          <img src="/images/lockup_angular_wht.svg" alt="Angular" />
        </div>
        <div class="nestjs-brand">
          <img src="/images/nestjs-logo.svg" alt="NestJS" />
          <span>NestJS</span>
        </div>
      </div>
    </header>
  `,
  styles: `
    header {
      display: flex;
      height: 64px;
      flex-shrink: 0;
    }
    .left-side {
      display: flex;
      align-items: center;
      padding-left: 1rem;
      flex-shrink: 0;
    }
    .right-side {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-grow: 1;
      padding-right: 1rem;
      gap: 20px;
      background: linear-gradient(
        90deg,
        #ffffff 0%,
        #ffffff 30%,
        #e0224e 50%,
        #e0224e 65%,
        #7638ff 80%
      );
      height: 100%;
    }
    .right-side img {
      height: 28px;
      width: auto;
    }
    .angular-brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }    
    .nestjs-brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nestjs-brand span {
      color: white;
      font-size: 18px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    }
  `,
})
export class AppHeaderComponent {}
