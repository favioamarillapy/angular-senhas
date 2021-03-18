import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlImgSanitizerPipe } from './url-img-sanitizer.pipe';

@NgModule({
  declarations: [
    UrlImgSanitizerPipe
  ],
  exports: [
    UrlImgSanitizerPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
