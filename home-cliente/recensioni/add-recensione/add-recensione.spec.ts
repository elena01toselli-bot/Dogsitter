import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecensione } from './add-recensione';

describe('AddRecensione', () => {
  let component: AddRecensione;
  let fixture: ComponentFixture<AddRecensione>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRecensione],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecensione);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
