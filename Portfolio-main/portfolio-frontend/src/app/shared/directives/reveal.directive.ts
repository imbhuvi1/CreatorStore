import { Directive, ElementRef, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit {
  private el = inject(ElementRef<HTMLElement>);
  ngOnInit() {
    const node = this.el.nativeElement;
    node.classList.add('reveal');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('in');
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { node.classList.add('in'); io.disconnect(); } });
    }, { threshold: 0.15 });
    io.observe(node);
  }
}
