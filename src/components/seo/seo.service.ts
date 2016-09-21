import { Injectable, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/platform-browser'

@Injectable()

export class SeoService {
 /**
  * Angular 2 Title Service
  */
  private titleService: Title;
 /**
  * <head> Element of the HTML document
  */
  private headElement: HTMLElement;
 /**
  * <head> Element of the HTML document
  */
  private metaDescription: HTMLElement;
 /**
  * <head> Element of the HTML document
  */
  private robots: HTMLElement;
  private DOM: any;

  private openGraph: Object;

 /**
  * Inject the Angular 2 Title Service
  * @param titleService
  */
  constructor(titleService: Title, @Inject(DOCUMENT) private document){
    this.titleService = titleService;
    this.DOM = DOCUMENT;

   /**
    * get the <head> Element
    * @type {any}
    */
    this.headElement = document.querySelector('head');
    this.metaDescription = this.getOrCreateMetaElement('description');
    this.robots = this.getOrCreateMetaElement('robots');
    this.openGraph = this.getOpenGraphMetas();
  }

  public getOpenGraphMetas() {
    return {
      title: this.getOpenGraphMeta('og:title'),
      siteName: this.getOpenGraphMeta('og:site_name'),
      url: this.getOpenGraphMeta('og:url'),
      type: this.getOpenGraphMeta('og:type'),
      image: this.getOpenGraphMeta('og:image'),
      description: this.getOpenGraphMeta('og:description')
    }
  }

  public setOpenGraphMeta(property, content) {
    this.openGraph[property].content = content;
  }

  public getOpenGraphMeta(property) {
    return document.querySelector(`meta[property="${property}"]`);
  }

  public getTitle(): string {
    return this.titleService.getTitle();
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  public getMetaDescription(): string {
    return this.metaDescription.getAttribute('content');
  }

  public setMetaDescription(description: string) {
    this.metaDescription.setAttribute('content', description);
  }

  public getMetaRobots(): string {
    return this.robots.getAttribute('content');
  }

  public setMetaRobots(robots: string) {
    this.robots.setAttribute('content', robots);
  }

   /**
    * get the HTML Element when it is in the markup, or create it.
    * @param name
    * @returns {HTMLElement}
    */
    private getOrCreateMetaElement(name: string): HTMLElement {
      let el;
      el = document.querySelector('meta[name=' + name + ']');
      if (el === null) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        this.headElement.appendChild(el);
      }
      return el;
    }

}
