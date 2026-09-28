/* =====================================================================
   script.js  —  منطق الموقع
   الملف مقسّم لجزئين:
   1) DATA: كل النصوص والبيانات (ده المكان اللي هتعدل فيه غالبًا)
   2) LOGIC: الوظائف (مش محتاج تلمسها إلا لو عايز تغيّر السلوك)
   ===================================================================== */
'use strict';

/* =====================================================================
   1) DATA — عدّل النصوص من هنا
   ===================================================================== */

/* أسئلة الـQuiz
   q     = نص السؤال
   miss  = النص اللي يظهر في "الحاجات اللي محتاجة تظبطها" لو الإجابة "لا" */
const QUESTIONS = [
  { q: 'هل تم إعداد وتهيئة المتجر؟',                 miss: 'إعداد وتهيئة المتجر' },
  { q: 'هل تم إنشاء الأقسام وإضافة المنتجات؟',       miss: 'إنشاء الأقسام وإضافة المنتجات' },
  { q: 'هل تم تجهيز سياسات المتجر؟',                 miss: 'تجهيز سياسات المتجر' },
  { q: 'هل الصفحة الرئيسية ونموذج الشراء جاهزين؟',   miss: 'تجهيز الصفحة الرئيسية ونموذج الشراء' },
  { q: 'هل إعدادات الشحن والدفع مضبوطة؟',            miss: 'ضبط إعدادات الشحن والدفع' },
  { q: 'هل تم ربط Meta Pixel / TikTok Pixel؟',       miss: 'ربط Meta Pixel / TikTok Pixel' },
  { q: 'هل تم عمل Test Order؟',                      miss: 'عمل Test Order' },
  { q: 'هل راجعت تجربة المستخدم قبل الإطلاق؟',       miss: 'مراجعة تجربة المستخدم قبل الإطلاق' }
];

/* المراحل الست
  goTo = معرّف ثابت لحفظ حالة المرحلة */
const STAGES = [
  { title: 'سجل حساب هنا',
    text: 'أنشئ حسابك في منصة Easy Orders للبدء.',
    linkUrl: 'https://www.easy-orders.net?view=cd519ceb-f9f8-4066-97d4-6520850d8225',
    linkLabel: 'سجل حساب هنا',
    videoUrl: '',
    goTo: 'account' },
  { title: 'إعداد وتهيئة المتجر',
    text: 'اختيار منصة Order Easy، ضبط إعدادات النطاق والبيانات الأساسية للمتجر.',
    videoUrl: 'https://www.youtube.com/watch?v=dmeKAMb_1Zc&list=PLTvFEqr7Kr-A',
    goTo: 'store' },
  { title: 'الأقسام وإضافة المنتجات',
    text: 'إنشاء التصنيفات الرئيسية والفرعية، كتابة الوصف البيعي للمنتج، ورفع صور عالية الجودة.',
    videoUrl: 'https://www.youtube.com/watch?v=Pcynfri9LaU&list=PLJ2rY5BmZiTk',
    goTo: 'categories' },
  { title: 'سياسات المتجر',
    text: 'إضافة سياسة الاستبدال والاسترجاع، الشروط والأحكام، وسياسة الخصوصية.',
    videoUrl: 'https://www.youtube.com/watch?v=T9une-hf-eQ&list=PLFN7PFBC0pN0',
    goTo: 'policies' },
  { title: 'الصفحة الرئيسية + الشراء + الشحن والدفع',
    text: 'تنسيق الصفحة الرئيسية، إعداد الدفع عند الاستلام، تحديد أسعار الشحن وتبسيط عملية إتمام الشراء.',
    videoUrl: 'https://www.youtube.com/watch?v=zq0kviUgkXk&list=PLWrztLWU1HIQ',
    goTo: 'home' },
  { title: 'الـPixel وتتبع الحملات',
    text: 'ربط Pixel Meta وPixel TikTok لتتبع التحويلات والمبيعات.',
    videoUrl: 'https://www.youtube.com/watch?v=fYE2-h3G4QA&list=PLRrV299rCif4',
    goTo: 'pixel' },
  { title: 'المرحلة النهائية',
    text: 'عمل Test Order والتأكد من وصول الإشعارات وسرعة المتجر ومراجعة تجربة المستخدم قبل الإطلاق.',
    videoUrl: 'https://www.youtube.com/watch?v=lCHuyCuoeH8&list=PLccBQN6wopWc',
    goTo: 'test' }
];

/* القوالب (نصوص تجريبية — عدّلها براحتك) */
const TEMPLATES = [
  { title: 'وصف منتج',
    text: 'اسم المنتج: [اكتب الاسم]\nالمميزات:\n- [ميزة 1]\n- [ميزة 2]\n- [ميزة 3]\nالمقاسات/الألوان المتاحة: [...]\nاطلب دلوقتي والدفع عند الاستلام.' },
  { title: 'سياسة الاستبدال والاسترجاع',
    text: 'يمكنك استبدال أو استرجاع المنتج خلال [عدد] أيام من الاستلام بشرط [الشروط]. للتواصل: [رقم/بريد المتجر]. (نص تجريبي، راجعه وعدّله حسب سياسة متجرك.)' },
  { title: 'رسالة تأكيد الطلب',
    text: 'أهلًا [اسم العميل]، تم استلام طلبك رقم [رقم الطلب]. هنتواصل معاك لتأكيد العنوان، والتوصيل خلال [المدة]. شكرًا لثقتك في [اسم المتجر].' },
  { title: 'الأسئلة الشائعة',
    text: 'س: مدة الشحن؟\nج: [المدة]\n\nس: طرق الدفع؟\nج: [الطرق المتاحة]\n\nس: أقدر أسترجع المنتج؟\nج: [حسب السياسة]' }
];

/* إعدادات عامة */
const CONFIG = {
  storageKey: 'store-checklist-v2',
  toastMs: 2200,
  copyMessage: 'تم نسخ النص ✓'
};

/* =====================================================================
   2) LOGIC
   ===================================================================== */

const $ = (selector) => document.querySelector(selector);

/* ---------- Toast ---------- */
const toastEl = $('#toast');
let toastTimer;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), CONFIG.toastMs);
}

/* ---------- قائمة الموبايل ---------- */
function initMenu() {
  const burger = $('#burger');
  const menu = $('#menu');

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };

  burger.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => { if (e.target.tagName === 'A') setOpen(false); });
}

/* ---------- Quiz ---------- */
function initQuiz() {
  const body = $('#quiz-body');
  let index = 0;
  let answers = [];   // 1 = نعم ، 0 = لا

  function renderQuestion() {
    const percent = (index / QUESTIONS.length) * 100;
    body.innerHTML = `
      <div class="q-meta"><span>سؤال ${index + 1} من ${QUESTIONS.length}</span></div>
      <div class="bar" aria-hidden="true"><i style="width:${percent}%"></i></div>
      <p class="q-text">${QUESTIONS[index].q}</p>
      <div class="answers">
        <button class="btn primary" data-answer="1">نعم</button>
        <button class="btn no" data-answer="0">لا</button>
      </div>`;
  }

  function renderResult() {
    const score = answers.reduce((sum, a) => sum + a, 0);
    const missing = QUESTIONS
      .filter((_, i) => answers[i] === 0)
      .map((item) => `<li>${item.miss}</li>`)
      .join('');

    body.innerHTML = `
      <p class="score">جاهزية متجرك: ${score} / ${QUESTIONS.length}</p>
      ${missing
        ? `<p><strong>الحاجات اللي محتاجة تظبطها:</strong></p><ul class="missing">${missing}</ul>`
        : '<p>جاوبت "نعم" على كل الأسئلة. راجع رحلة تجهيز المتجر لتأكيد إنجاز المراحل.</p>'}
      <div class="actions">
        <a class="btn primary" href="#journey">راجع رحلة التجهيز</a>
        <button class="btn ghost" id="quiz-again">أعد الاختبار</button>
      </div>`;
  }

  body.addEventListener('click', (e) => {
    const { answer } = e.target.dataset;
    if (answer !== undefined) {
      answers.push(Number(answer));
      index += 1;
      index < QUESTIONS.length ? renderQuestion() : renderResult();
    } else if (e.target.id === 'quiz-again') {
      index = 0;
      answers = [];
      renderQuestion();
    }
  });

  renderQuestion();
}

/* ---------- المراحل ---------- */
function renderStages() {
  $('#stages').innerHTML = STAGES.map((stage, i) => `
    <article class="card stage-card" data-stage="${stage.goTo}">
      <div class="stage-head">
        <span class="num">${String(i + 1).padStart(2, '0')}</span>
        <span class="stage-status">لاحقًا</span>
      </div>
      <h3>${stage.title}</h3>
      <p>${stage.text}</p>
      <div class="stage-resources">
        ${stage.linkUrl
          ? `<a class="stage-link" href="${stage.linkUrl}" target="_blank" rel="noopener noreferrer">${stage.linkLabel} ↗</a>`
          : ''}
        ${stage.videoUrl
          ? `<a class="video-link" href="${stage.videoUrl}" target="_blank" rel="noopener noreferrer">شاهد فيديو المرحلة ↗</a>`
          : ''}
      </div>
      <button class="btn ghost stage-complete" data-go="${stage.goTo}" data-has-video="${Boolean(stage.videoUrl)}" aria-pressed="false"></button>
    </article>`).join('');
}

/* ---------- إنجاز المراحل ومؤشر الهيدر ---------- */
function initJourneyProgress() {
  let state = {};
  try { state = JSON.parse(localStorage.getItem(CONFIG.storageKey)) || {}; }
  catch { /* التخزين غير متاح — الموقع يكمل عادي */ }

  const progressLink = $('#journey-progress');
  const progressRing = $('#journey-progress-ring');
  const progressCount = $('#journey-progress-count');
  const progressSummary = $('#journey-progress-summary');
  const nextStep = $('#journey-next-step');
  const progressBar = $('#journey-progress-bar');
  const progressFill = $('#journey-progress-fill');
  const resetButton = $('#journey-reset');

  function renderProgress() {
    const done = STAGES.filter((stage) => state[stage.goTo]).length;
    const nextStage = STAGES.find((stage) => !state[stage.goTo]);
    const progress = done / STAGES.length;
    const percent = Math.round(progress * 100);
    progressRing.style.strokeDashoffset = String(100.53 * (1 - progress));
    progressCount.textContent = `${done}/${STAGES.length}`;
    progressLink.setAttribute('aria-label', `تقدم تجهيز المتجر: ${done} من ${STAGES.length}`);
    progressSummary.textContent = `أنجزت ${done} من ${STAGES.length} مراحل (${percent}٪)`;
    nextStep.textContent = nextStage
      ? `الخطوة التالية: ${nextStage.title}`
      : 'اكتملت رحلة تجهيز المتجر. أحسنت!';
    progressBar.setAttribute('aria-valuenow', String(percent));
    progressFill.style.width = `${percent}%`;
    resetButton.disabled = done === 0;

    document.querySelectorAll('[data-go]').forEach((button) => {
      const complete = Boolean(state[button.dataset.go]);
      const isNext = !complete && button.dataset.go === nextStage?.goTo;
      const card = button.closest('.stage-card');
      card.classList.toggle('is-complete', complete);
      card.classList.toggle('is-next', isNext);
      card.querySelector('.stage-status').textContent = complete
        ? 'مكتملة'
        : isNext ? 'ابدأ هنا' : 'لاحقًا';
      button.setAttribute('aria-pressed', String(complete));
      button.textContent = complete
        ? 'إلغاء إتمام المرحلة'
        : button.dataset.hasVideo === 'true'
          ? 'تأكيد المشاهدة والإتمام'
          : 'تأكيد إتمام المرحلة';
      button.classList.toggle('primary', complete);
      button.classList.toggle('ghost', !complete);
    });
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-go]');
    if (!button) return;

    const stageId = button.dataset.go;
    state[stageId] = !state[stageId];
    try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(state)); }
    catch { /* التخزين غير متاح — الموقع يكمل عادي */ }
    renderProgress();
  });

  resetButton.addEventListener('click', () => {
    state = {};
    try { localStorage.removeItem(CONFIG.storageKey); }
    catch { /* التخزين غير متاح — الموقع يكمل عادي */ }
    renderProgress();
  });

  renderProgress();
}

/* ---------- القوالب + النسخ ---------- */
function renderTemplates() {
  $('#tpl').innerHTML = TEMPLATES.map((tpl, i) => `
    <article class="card">
      <h3>${tpl.title}</h3>
      <p class="pre">${tpl.text}</p>
      <button class="btn ghost" data-copy="${i}">نسخ النص</button>
    </article>`).join('');
}

function copyText(text) {
  const done = () => showToast(CONFIG.copyMessage);

  /* طريقة احتياطية لو الـClipboard API مش شغال (مثلًا فتح الملف مباشرة) */
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); }
    catch { showToast('تعذّر النسخ'); }
    ta.remove();
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done, fallback);
  } else {
    fallback();
  }
}

function initTemplates() {
  renderTemplates();
  $('#tpl').addEventListener('click', (e) => {
    const { copy } = e.target.dataset;
    if (copy !== undefined) copyText(TEMPLATES[Number(copy)].text);
  });
}

/* ---------- ظهور المحتوى أثناء التمرير ---------- */
function initReveal() {
  if (!('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll(
    'main > section:not(.hero), .grid > *, .foot'
  );

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

  targets.forEach((target) => {
    target.classList.add('reveal-target');
    observer.observe(target);
  });
}

/* ---------- تشغيل كل حاجة ---------- */
initMenu();
initQuiz();
renderStages();
initJourneyProgress();
initTemplates();
initReveal();
