import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'countries-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group(
    {
      region: ['', Validators.required],
      country: ['', Validators.required],
      borders: ['', Validators.required],
    }
  );

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ) {}

  ngOnInit(): void {

    this.onRegionChanged();
    this.onCountryChanged();

  }

  get regions(): Region[] {
    return this.countriesService.regions;
    // return [];
  }

  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('country')!.setValue('') ),
        switchMap( (region) => this.countriesService.getCountriesByRegion( region ) ),
      )
      .subscribe( countries => {
        this.countriesByRegion = countries;
      });
  }

  onCountryChanged(): void {
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('borders')!.setValue('') ),
        tap( () => this.borders = [] ),
        filter( (value:string) => value.length > 0 ),
        // switchMap( (region) => this.countriesService.getCountriesByRegion( region ) ),
        switchMap( ( alphaCode ) => this.countriesService.getCountryByAlphaCode( alphaCode ) ),
        switchMap( ( country ) => this.countriesService.getCountryBordersByCodes( country.borders ) ),
      )
      .subscribe( countries => {
        console.log({ countries: countries });
        this.borders = countries;
      });
  }

}
