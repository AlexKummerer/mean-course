import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './header/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './angular-material.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    const authServiceMock = {
      autoAuthUser:  jasmine.createSpy('autoAuthUser').and.returnValue(true)
    };

    TestBed.configureTestingModule({
      declarations: [AppComponent, HeaderComponent],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        AngularMaterialModule
      ],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should call 'autoAuthUser' on initialization`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const authService = TestBed.inject(AuthService);
    app.ngOnInit();
    expect(authService.autoAuthUser).toHaveBeenCalled();
  });
});
