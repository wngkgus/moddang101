(() => {
  const modal = (title, subtitle, body) => {
    document.querySelector('.search-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = '<section class="search-box service-modal"><button class="modal-close" aria-label="닫기">×</button><h2>' + title + '</h2><p>' + subtitle + '</p>' + body + '</section>';
    overlay.addEventListener('click', e => { if (e.target === overlay || e.target.closest('.modal-close')) overlay.remove(); });
    document.body.append(overlay);
    overlay.querySelector('input')?.focus();
    const searchForm = overlay.querySelector('form');
    if (searchForm?.querySelector('input')?.placeholder.includes('상품명')) {
      searchForm.addEventListener('submit', e => { e.preventDefault(); window.toast('검색 결과를 준비 중입니다.'); });
    }
  };
  window.openAuth = signup => {
    const title = signup ? '회원가입' : '로그인';
    const fields = signup
      ? '<input class="field" placeholder="이름" required><input class="field" type="email" placeholder="이메일 주소" required><input class="field" type="password" placeholder="비밀번호" required><label class="consent"><input type="checkbox" required> 이용약관과 개인정보 처리에 동의합니다.</label>'
      : '<input class="field" placeholder="아이디 또는 이메일" required><input class="field" type="password" placeholder="비밀번호" required>';
    modal(title, signup ? '몽땅 101 회원 혜택과 주문 내역을 확인하세요.' : '회원 계정으로 주문과 관심 상품을 확인하세요.',
      '<form class="service-form">' + fields + '<button class="primary-btn">' + title + '</button></form>' +
      '<button class="text-link" data-switch>' + (signup ? '로그인으로 돌아가기' : '회원가입하기') + '</button>');
    const overlay = document.querySelector('.search-overlay');
    overlay.querySelector('form').addEventListener('submit', e => { e.preventDefault(); window.toast('회원 서비스 연결 후 이용할 수 있습니다.'); });
    overlay.querySelector('[data-switch]').addEventListener('click', () => window.openAuth(!signup));
  };
  window.openSearch = () => modal('몽땅 검색', '찾으시는 내용을 입력해 주세요.',
    '<form class="service-form"><input class="field" placeholder="상품명이나 원료를 입력해 주세요"><button class="primary-btn">검색하기</button></form>');
  window.openInquiry = () => {
    modal('문의하기', '궁금한 점을 남겨주시면 확인 후 답변드리겠습니다.',
      '<form class="service-form"><input class="field" placeholder="이름"><input class="field" type="email" placeholder="이메일 주소"><input class="field" placeholder="문의 제목"><textarea class="field" rows="5" placeholder="문의 내용을 입력해 주세요"></textarea><button class="primary-btn">문의 등록</button></form>');
    document.querySelector('.service-form')?.addEventListener('submit', e => { e.preventDefault(); window.toast('문의 기능 연결 후 접수할 수 있습니다.'); });
  };
  window.openCart = () => {
    const count = Number(localStorage.getItem('m101-cart') || 0);
    modal('장바구니', count ? '몽땅 101 ' + count + '개를 담았습니다.' : '장바구니가 비어 있습니다.',
      '<button class="primary-btn" data-close>상품 보러가기</button>');
    document.querySelector('[data-close]').addEventListener('click', () => { document.querySelector('.search-overlay')?.remove(); document.querySelector('#product')?.scrollIntoView({behavior:'smooth'}); });
  };
  window.addCart = () => {
    const count = Number(localStorage.getItem('m101-cart') || 0) + Number(document.querySelector('#qty')?.textContent || 1);
    localStorage.setItem('m101-cart', String(count));
    window.toast('장바구니에 담았습니다.');
  };
  window.openCouponPack = () => modal('신규 회원 쿠폰팩', '회원 가입 혜택을 확인해 보세요. 금액과 사용 조건은 실제 운영 정보에 맞게 등록해야 합니다.',
    '<div class="coupon-grid"><div class="coupon-ticket"><b>3,000원</b><span>첫 구매 쿠폰 예시</span></div><div class="coupon-ticket"><b>5,000원</b><span>묶음 구성 쿠폰 예시</span></div><div class="coupon-ticket"><b>무료배송</b><span>배송 쿠폰 예시</span></div></div><button class="primary-btn" data-join>회원가입하기</button>');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-coupons]')) window.openCouponPack(); if (e.target.closest('[data-join]')) { document.querySelector('.search-overlay')?.remove(); window.openAuth(true); }
  });
  const intakeChart=document.querySelector('.intake-stats');
  if(intakeChart&&'IntersectionObserver' in window){const chartObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-animated');chartObserver.unobserve(entry.target)}}),{threshold:.25});chartObserver.observe(intakeChart);} else {intakeChart?.classList.add('is-animated');}  const sticky=document.querySelector('#sticky-detail-buy'); window.addEventListener('scroll',()=>sticky?.classList.toggle('show',['home','product'].includes(document.body.dataset.page)&&window.scrollY>520),{passive:true});  document.querySelectorAll('.tabs a, #product-subnav a').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      document.querySelectorAll('.tabs a, #product-subnav a').forEach(tab => tab.classList.remove('on'));
      link.classList.add('on');
      history.replaceState({page:'product'}, '', link.getAttribute('href'));
      target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
  const pages = {home:['.hero','#home-feature'], products:['#products'], product:['.crumb','#product','.tabs','#detail','#reviews','#qna','#faq','#guide'], reviews:['#reviews'], qna:['#qna'], guide:['#guide'], faq:['#faq'], support:['#faq','#guide']};
  window.showPage = (page, updateHash=true) => {
    const main=document.querySelector('main'); if(!pages[page]) page='home';
    const allowed=new Set(pages[page].map(s=>document.querySelector(s)).filter(Boolean));
    [...main.children].forEach(el=>{ if(el.matches('.hero')) el.hidden=page!=='home'; else if(el.matches('.wrap')) [...el.children].forEach(child=>{child.hidden=!allowed.has(child);}); else if(el.matches('section')) el.hidden=!allowed.has(el); else if(el.matches('.home-feature,.home-links')) el.hidden=!allowed.has(el); });
    if(page==='product') [...document.querySelectorAll('.wrap > section')].forEach(el=>el.hidden=false);
    document.body.dataset.page=page; const productView=page==='product'; const productSubnav=document.querySelector('#product-subnav'); if(productSubnav) productSubnav.hidden=!productView; document.querySelector('.tabs')?.toggleAttribute('hidden',!productView); if(updateHash) history.pushState({page},'',`#${page}`); window.scrollTo({top:0,behavior:'smooth'});
    document.querySelector('#sticky-detail-buy')?.classList.remove('show');
  };
  const routeFor = label => ({'홈':'home','몽땅 101':'product','모든 제품':'products','리뷰':'reviews','상품문의':'qna','Q&A':'qna','문의하기':'qna','고객센터':'support','반품/교환정보':'guide','자주 묻는 질문':'faq','회사소개':'home','이용약관':'guide','개인정보처리방침':'guide','이용안내':'support'})[label];
  document.querySelectorAll('.brand,.nav a,.footer-links a').forEach(a=>a.addEventListener('click',e=>{const page=a.classList.contains('brand')?'home':routeFor(a.textContent.trim());if(page){e.preventDefault();window.showPage(page)}}));
  window.addEventListener('popstate',e=>window.showPage(e.state?.page||'home',false));
  window.showPage(location.hash.slice(1)||'home',false);
})();












