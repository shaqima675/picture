/* ================================================================
   商链智控 · 宣传页交互逻辑
   ================================================================ */
(function () {
  'use strict';

  /* ============ 数据配置 ============ */

  // 款式展示数据
  var STYLE_DATA = {
    white_bg: {
      img: 'assets/templates/white_bg_product.png',
      badge: '01',
      eyebrow: 'STYLE · 白底商品图',
      title: '电商标准白底商品图',
      desc: '纯白色背景，商品居中放置，均匀柔和打光，无阴影无反光，清晰展示商品全貌，专业商品摄影风格，高清质感。'
    },
    scene: {
      img: 'assets/templates/model_outfit.png',
      badge: '02',
      eyebrow: 'STYLE · 场景模特图',
      title: '电商场景展示图',
      desc: '真实生活化使用场景，模特与产品自然互动，场景光线自然温馨，画面有故事感和代入感，高级商业摄影质感。'
    },
    feature: {
      img: 'assets/templates/feature_highlight.png',
      badge: '03',
      eyebrow: 'STYLE · 卖点展示图',
      title: '电商核心卖点视觉化',
      desc: '用创意视觉方式突出产品最核心的功能卖点，画面简洁有力，重点信息一目了然，配以简洁文字标注区域，现代商业设计风格。'
    },
    poster: {
      img: 'assets/templates/tech_scene.png',
      badge: '04',
      eyebrow: 'STYLE · 创意海报图',
      title: '电商创意海报图',
      desc: '视觉冲击力强，大胆创意构图，画面具有广告级表现力，色彩饱和鲜明，排版设计感强，适合营销传播使用。'
    }
  };

  // 视频模板数据（精选6个，每类2个）
  var VIDEO_TEMPLATES = [
    { id: 'v_sku_color_switch', name: 'SKU多色自动切换', cat: '商品基础展示类', hot: true },
    { id: 'v_360_rotate', name: '360°旋转展示', cat: '商品基础展示类', hot: false },
    { id: 'v_person_hold', name: '真人手持好物推荐', cat: '带货种草类', hot: true },
    { id: 'v_immersive_story', name: '沉浸式剧情种草', cat: '带货种草类', hot: true },
    { id: 'v_countdown_sale', name: '限时秒杀倒计时', cat: '活动营销促销类', hot: true },
    { id: 'v_new_product_reveal', name: '新品首发预告', cat: '活动营销促销类', hot: false }
  ];

  // 灵感模板数据（精选6个，跨品类）
  var INSPIRATION_TEMPLATES = [
    { id: 'white_bg_product', name: '白底商品图', cat: '服饰鞋包', hot: true },
    { id: 'model_outfit', name: '模特穿搭图', cat: '服饰鞋包', hot: true },
    { id: 'tech_scene', name: '科技场景主图', cat: '3C数码', hot: false },
    { id: 'texture_closeup', name: '质感特写图', cat: '美妆洗护', hot: true },
    { id: 'jewelry_premium', name: '珠宝高级展示图', cat: '珠宝首饰', hot: false },
    { id: 'gift_unboxing', name: '礼盒开箱图', cat: '珠宝首饰', hot: false }
  ];

  /* ============ 通用工具 ============ */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function showToast(msg) {
    var toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2500);
  }

  /* ============ 1. 顶部导航 ============ */
  function initHeader() {
    var header = $('.site-header');
    var menuBtn = $('#menuButton');
    var mobileNav = $('#mobileNav');

    // 滚动时缩小 header
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });

    // 移动端菜单
    if (menuBtn && mobileNav) {
      menuBtn.addEventListener('click', function () {
        menuBtn.classList.toggle('active');
        mobileNav.classList.toggle('open');
        var expanded = mobileNav.classList.contains('open');
        menuBtn.setAttribute('aria-expanded', expanded);
      });
      // 点击导航链接后关闭菜单
      $all('a', mobileNav).forEach(function (link) {
        link.addEventListener('click', function () {
          menuBtn.classList.remove('active');
          mobileNav.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ============ 2. 滚动锚点 ============ */
  function initScrollTargets() {
    $all('[data-scroll-target]').forEach(function (el) {
      el.addEventListener('click', function () {
        var target = el.getAttribute('data-scroll-target');
        var el2 = $(target);
        if (el2) {
          el2.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ============ 3. 滚动渐入动画 ============ */
  function initReveal() {
    var reveals = $all('.reveal');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ============ 4. 数据计数器动画 ============ */
  function initCounters() {
    var counters = $all('[data-count]');
    if (!counters.length) return;
    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          var current = 0;
          var step = Math.max(1, Math.ceil(target / 30));
          var timer = setInterval(function () {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current;
          }, 40);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ============ 5. Hero 打字→出图动效 ============ */
  function initHeroDemo() {
    var typingEl = $('#demoTyping');
    var outputEl = $('#demoOutput');
    if (!typingEl || !outputEl) return;

    var prompt = '一款琥珀色香水';
    var images = $all('.demo-img', outputEl);
    var charIndex = 0;
    var typingDone = false;

    function typeChar() {
      if (charIndex < prompt.length) {
        typingEl.textContent += prompt[charIndex];
        charIndex++;
        setTimeout(typeChar, 80 + Math.random() * 60);
      } else {
        typingDone = true;
        // 逐张展示图片
        images.forEach(function (img, i) {
          setTimeout(function () {
            img.classList.add('show');
          }, 300 + i * 500);
        });
      }
    }

    // 延迟启动，等渐入动画完成
    setTimeout(typeChar, 1000);

    // 循环重播（可选）
    function replay() {
      setTimeout(function () {
        charIndex = 0;
        typingEl.textContent = '';
        typingDone = false;
        images.forEach(function (img) { img.classList.remove('show'); });
        setTimeout(typeChar, 500);
        replay();
      }, 8000);
    }
    replay();
  }

  /* ============ 6. 图片创作款式切换 ============ */
  function initShowcaseTabs() {
    var tabs = $all('.showcase-tab');
    if (!tabs.length) return;
    var imgEl = $('#showcaseImage');
    var badgeEl = $('#showcaseBadge');
    var eyebrowEl = $('#showcaseEyebrow');
    var titleEl = $('#showcaseTitle');
    var descEl = $('#showcaseDesc');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var styleId = tab.getAttribute('data-style');
        var data = STYLE_DATA[styleId];
        if (!data) return;

        // 更新 tab 状态
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // 更新内容（带淡入效果）
        if (imgEl) {
          imgEl.style.opacity = '0';
          setTimeout(function () {
            imgEl.src = data.img;
            imgEl.alt = data.title;
            imgEl.style.opacity = '1';
          }, 200);
        }
        if (badgeEl) badgeEl.innerHTML = '<b>' + data.badge + '</b>' + tab.textContent;
        if (eyebrowEl) eyebrowEl.textContent = data.eyebrow;
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
      });
    });
  }

  /* ============ 7. 套图裂变动画 ============ */
  function initSuiteAnimation() {
    var items = $all('.suite-item');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('show'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          items.forEach(function (item, i) {
            setTimeout(function () {
              item.classList.add('show');
            }, i * 120);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
    var grid = $('#suiteGrid');
    if (grid) observer.observe(grid);
  }

  /* ============ 8. 视频创作墙 ============ */
  function initVideoWall() {
    var grid = $('#videoGrid');
    var filters = $all('.video-filter');
    if (!grid) return;

    function renderVideos(cat) {
      var list = cat === '全部' ? VIDEO_TEMPLATES : VIDEO_TEMPLATES.filter(function (v) { return v.cat === cat; });
      grid.innerHTML = list.map(function (v) {
        return '<div class="video-card" data-video="assets/videos/' + v.id + '.mp4" data-title="' + v.name + '">' +
          '<video src="assets/videos/' + v.id + '.mp4" muted loop playsinline preload="none"></video>' +
          (v.hot ? '<span class="video-card-tag">热门</span>' : '') +
          '<div class="video-card-play">▶</div>' +
          '<div class="video-card-overlay"><b>' + v.name + '</b><small>' + v.cat + '</small></div>' +
          '</div>';
      }).join('');

      // 绑定悬停预览
      $all('.video-card', grid).forEach(function (card) {
        var video = card.querySelector('video');
        var isPlaying = false;

        card.addEventListener('mouseenter', function () {
          if (!video.src) return;
          video.play().then(function () {
            isPlaying = true;
          }).catch(function () { /* 忽略自动播放限制 */ });
        });

        card.addEventListener('mouseleave', function () {
          if (isPlaying) {
            video.pause();
            video.currentTime = 0;
            isPlaying = false;
          }
        });

        // 点击播放/暂停
        card.addEventListener('click', function () {
          if (video.paused) {
            video.play().catch(function () {});
          } else {
            video.pause();
          }
        });
      });
    }

    // 初始渲染
    renderVideos('全部');

    // 分类筛选
    filters.forEach(function (filter) {
      filter.addEventListener('click', function () {
        filters.forEach(function (f) {
          f.classList.remove('active');
          f.setAttribute('aria-selected', 'false');
        });
        filter.classList.add('active');
        filter.setAttribute('aria-selected', 'true');
        renderVideos(filter.getAttribute('data-cat'));
      });
    });
  }

  /* ============ 9. 灵感模板库 ============ */
  function initInspiration() {
    var grid = $('#inspGrid');
    var filters = $all('.insp-filter');
    if (!grid) return;

    function renderTemplates(cat) {
      var list = cat === '全部' ? INSPIRATION_TEMPLATES : INSPIRATION_TEMPLATES.filter(function (t) { return t.cat === cat; });
      grid.innerHTML = list.map(function (t) {
        return '<div class="insp-card" data-img="assets/templates/' + t.id + '.png" data-title="' + t.name + '">' +
          '<div class="insp-card-img"><img src="assets/templates/' + t.id + '.png" alt="' + t.name + '" loading="lazy"></div>' +
          (t.hot ? '<span class="insp-card-hot">热门</span>' : '') +
          '<div class="insp-card-info"><b>' + t.name + '</b><small>' + t.cat + '</small></div>' +
          '</div>';
      }).join('');

      // 绑定灯箱
      $all('.insp-card', grid).forEach(function (card) {
        card.addEventListener('click', function () {
          openDialog(
            card.getAttribute('data-img'),
            card.getAttribute('data-title'),
            '点击「进入登录」使用此模板'
          );
        });
      });
    }

    renderTemplates('全部');

    filters.forEach(function (filter) {
      filter.addEventListener('click', function () {
        filters.forEach(function (f) {
          f.classList.remove('active');
          f.setAttribute('aria-selected', 'false');
        });
        filter.classList.add('active');
        filter.setAttribute('aria-selected', 'true');
        renderTemplates(filter.getAttribute('data-cat'));
      });
    });
  }

  /* ============ 10. 灯箱弹窗 ============ */
  function initLightbox() {
    var dialog = $('#mediaDialog');
    var dialogImg = $('#dialogImage');
    var dialogTitle = $('#dialogTitle');
    var dialogMeta = $('#dialogMeta');
    var closeBtn = $('#closeMediaDialog');
    if (!dialog) return;

    // 全局函数
    window.openDialog = function (src, title, meta) {
      if (dialogImg) dialogImg.src = src;
      if (dialogTitle) dialogTitle.textContent = title || '预览';
      if (dialogMeta) dialogMeta.textContent = meta || '';
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        if (typeof dialog.close === 'function') {
          dialog.close();
        } else {
          dialog.removeAttribute('open');
        }
      });
    }

    // 点击背景关闭
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) {
        if (typeof dialog.close === 'function') {
          dialog.close();
        } else {
          dialog.removeAttribute('open');
        }
      }
    });

    // ESC 关闭
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dialog.hasAttribute('open')) {
        if (typeof dialog.close === 'function') {
          dialog.close();
        } else {
          dialog.removeAttribute('open');
        }
      }
    });

    // 图片创作区放大按钮
    var expandShowcase = $('#expandShowcase');
    if (expandShowcase) {
      expandShowcase.addEventListener('click', function () {
        var img = $('#showcaseImage');
        var title = $('#showcaseTitle');
        if (img) {
          openDialog(img.src, title ? title.textContent : '图片预览', 'AI 生成电商图片');
        }
      });
    }

    // 套图项点击放大
    $all('.suite-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        var type = item.getAttribute('data-type');
        if (img) {
          openDialog(img.src, type, '套图类型 · 点击「进入登录」体验');
        }
      });
    });
  }

  /* ============ 初始化 ============ */
  function init() {
    initHeader();
    initScrollTargets();
    initReveal();
    initCounters();
    initHeroDemo();
    initShowcaseTabs();
    initSuiteAnimation();
    initVideoWall();
    initInspiration();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
