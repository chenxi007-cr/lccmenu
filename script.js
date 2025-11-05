document.addEventListener('DOMContentLoaded', function() {
  // 导航状态设置（保留原有代码）
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active', 'clicked');
    }
    link.addEventListener('click', function(e) {
      if (this.classList.contains('active')) {
        e.preventDefault();
        return;
      }
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('clicked'));
      this.classList.add('clicked');
    });
  });

  // Swiper轮播图初始化（保留原有代码）
  const swiper = new Swiper('.swiper-container', {
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 3000,
    },
  });

  const timeSections = document.querySelectorAll('.daily-time-limited');
  if (timeSections.length === 0) return;

  // 初始化检查
  updateTimeLimitedSections();
  
  // 设置定时检查（每分钟）
  setInterval(updateTimeLimitedSections, 60000);
  
  // 设置自动刷新
  setupAutoRefreshOnTimeEnd();

  function updateTimeLimitedSections() {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    timeSections.forEach(section => {
      const [startHour, startMinute] = section.dataset.start.split(':').map(Number);
      const [endHour, endMinute] = section.dataset.end.split(':').map(Number);
      const startTime = startHour * 100 + startMinute;
      const endTime = endHour * 100 + endMinute;

      // 处理跨天时段（如23:00-01:00）
      const isCrossDay = endTime < startTime;
      let isActive = false;

      if (isCrossDay) {
        isActive = currentTime >= startTime || currentTime <= endTime;
      } else {
        isActive = currentTime >= startTime && currentTime <= endTime;
      }

      if (isActive) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
  }

  function setupAutoRefreshOnTimeEnd() {
    const now = new Date();
    let closestRefreshTime = Infinity; // 存储最近的刷新时间点

    timeSections.forEach(section => {
      const [startHour, startMinute] = section.dataset.start.split(':').map(Number);
      const [endHour, endMinute] = section.dataset.end.split(':').map(Number);

      // 创建时段开始和结束时间对象
      const startDateTime = new Date(
        now.getFullYear(), now.getMonth(), now.getDate(),
        startHour, startMinute
      );
      const endDateTime = new Date(
        now.getFullYear(), now.getMonth(), now.getDate(),
        endHour, endMinute
      );

      // 处理跨天情况（结束日期+1天）
      if (endDateTime < startDateTime) {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }

      // 计算两个关键时间点：
      // 1. 当前时段结束时间（用于隐藏过期section）
      // 2. 下一时段开始时间（用于显示新section）
      const nowTime = now.getTime();
      let refreshTime = null;

      // 判断当前处于哪个时间段
      if (nowTime >= startDateTime.getTime() && nowTime <= endDateTime.getTime()) {
        // 当前时段内，设置为结束时间+1秒
        refreshTime = endDateTime.getTime() + 1000;
      } else {
        // 当前时段外，设置为下一次开始时间
        if (startDateTime < now) {
          // 今天的开始时间已过，设置为明天的开始时间
          startDateTime.setDate(startDateTime.getDate() + 1);
        }
        refreshTime = startDateTime.getTime();
      }

      // 计算距离刷新时间点的毫秒数
      const timeDiff = refreshTime - nowTime;

      // 只保留最近的刷新时间点
      if (timeDiff > 0 && timeDiff < closestRefreshTime) {
        closestRefreshTime = timeDiff;
      }
    });

    // 设置最近时间点的自动刷新
    if (closestRefreshTime !== Infinity) {
      setTimeout(() => {
        window.location.reload();
      }, closestRefreshTime);
      
      // 调试用：在控制台显示刷新倒计时
      console.log(`自动刷新将在 ${Math.ceil(closestRefreshTime/1000)} 秒后触发`);
    }
  }
})();

// 语言切换功能（保留原有代码）
function switchLang(lang) {
  const contents = document.querySelectorAll('.lang-content');
  const buttons = document.querySelectorAll('.lang-toggle button');
  contents.forEach(p => {
    p.style.display = p.getAttribute('data-lang') === lang ? 'block' : 'none';
  });
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(lang));
  });
}