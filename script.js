// scroll reveal
function initReveal(){
  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:0.08, rootMargin:'0px 0px -60px 0px'});
    els.forEach(el=>io.observe(el));
  } else {
    els.forEach(el=>el.classList.add('in'));
  }
}

// blood-write effect: splits text into spans that reveal like ink/blood being written
function initBloodText(){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const blocks = document.querySelectorAll('.blood-text');
  blocks.forEach(block=>{
    const text = block.textContent;
    block.textContent = '';
    block.setAttribute('aria-label', text);
    [...text].forEach((ch, i)=>{
      const span = document.createElement('span');
      span.className = 'bw-char';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      if(!reduced){ span.style.animationDelay = (i * 0.018) + 's'; }
      else { span.style.opacity = '1'; span.style.color = 'var(--bone-dim)'; }
      block.appendChild(span);
    });
  });

  if(!reduced && 'IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('bw-play');
          io.unobserve(e.target);
        } else {
          // pause until visible: restart animation by toggling class
        }
      });
    }, {threshold:0.3});
    blocks.forEach(b=>{
      b.querySelectorAll('.bw-char').forEach(s=>{ s.style.animationPlayState = 'paused'; });
      io.observe(b);
    });
    const io2 = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.querySelectorAll('.bw-char').forEach(s=>{ s.style.animationPlayState = 'running'; });
        }
      });
    }, {threshold:0.3});
    blocks.forEach(b=>io2.observe(b));
  }
}

// hover glow: wrap words so each one can light up under the cursor
function initHoverGlow(){
  const selector = '.page h2, .page h3, .page h4, .page p:not(.blood-text), .page li, .callout';
  document.querySelectorAll(selector).forEach(el=>{
    if(el.dataset.hoverified) return;
    el.dataset.hoverified = "1";
    const parts = el.textContent.split(/(\s+)/);
    el.textContent = '';
    parts.forEach(part=>{
      if(part.trim() === ''){
        el.appendChild(document.createTextNode(part));
      } else {
        const span = document.createElement('span');
        span.className = 'hoverword';
        span.textContent = part;
        el.appendChild(span);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  initReveal();
  initBloodText();
  initHoverGlow();
});
