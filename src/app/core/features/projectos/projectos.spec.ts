import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Projectos } from './projectos';

describe('Projectos', () => {
  let component: Projectos;
  let fixture: ComponentFixture<Projectos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Projectos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Projectos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
