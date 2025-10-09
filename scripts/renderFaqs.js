// renderer: fetches data/faqs.json and renders into #faqList
(async function(){
  const container = document.getElementById('faqList');
  if (!container) return;

  try {
    const resp = await fetch('data/faqs.json');
    if (!resp.ok) throw new Error('Failed to load faqs.json');
    const faqs = await resp.json();

    faqs.forEach((faq, idx) => {
      const item = document.createElement('div');
      item.className = 'faq-item';

      const btn = document.createElement('button');
      const id = `faq${idx+1}`;
      btn.className = 'faq-question';
      btn.type = 'button';
      btn.id = `${id}-btn`;
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', id);
      btn.innerHTML = `${faq.question} <span class="faq-chevron" aria-hidden="true">+</span>`;

      const answer = document.createElement('div');
      answer.className = 'faq-answer';
      answer.id = id;
      answer.role = 'region';
      answer.setAttribute('aria-labelledby', `${id}-btn`);
      answer.hidden = true;
      answer.innerText = faq.answer;

      item.appendChild(btn);
      item.appendChild(answer);
      container.appendChild(item);
    });

    // single-open accordion behavior (event delegation)
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq-question');
      if (!btn) return;
      const item = btn.closest('.faq-item');
      const answerId = btn.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);
      const isOpen = item.classList.contains('open');

      // close all
      Array.from(container.querySelectorAll('.faq-item.open')).forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          const openBtn = openItem.querySelector('.faq-question');
          const openAnswer = openItem.querySelector('.faq-answer');
          if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
          if (openAnswer) openAnswer.hidden = true;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        if (answer) answer.hidden = true;
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        if (answer) answer.hidden = false;
      }
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>Failed to load FAQs.</p>';
  }
})();