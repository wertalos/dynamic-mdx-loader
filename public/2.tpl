<h1>Услуги компании {{company.name}}</h1>

<p>Привет, <strong>{{user.name}}</strong>! Вот что мы можем предложить:</p>

<h2>Наши услуги</h2>

{{#each services}}
<div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin: 16px 0; border: 1px solid #e9ecef;">
  <h3>{{name}}</h3>
  <p><strong>Стоимость:</strong> {{price}} руб.</p>
  <p><strong>Срок выполнения:</strong> {{duration}}</p>
  
  <button onclick="alert('Заявка на {{name}} принята!')" 
          style="background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer;">
    Заказать услугу
  </button>
</div>
{{/each}}

<h2>Процесс работы</h2>

<div style="background: #d1ecf1; padding: 16px; border-radius: 8px; margin: 16px 0;">
  <strong>Этап 1:</strong> Анализ требований ({{currentDate}})
</div>

<div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin: 16px 0;">
  <strong>Этап 2:</strong> Дизайн и прототипирование
</div>

<div style="background: #d4edda; padding: 16px; border-radius: 8px; margin: 16px 0;">
  <strong>Этап 3:</strong> Разработка и тестирование
</div>

<div style="background: #f8d7da; padding: 16px; border-radius: 8px; margin: 16px 0;">
  <strong>Этап 4:</strong> Деплой и поддержка
</div>

<button onclick="alert('Свяжитесь с {{company.name}} для расчета!')" 
        style="background: #27ae60; color: white; padding: 16px 32px; border: none; border-radius: 6px; cursor: pointer; font-size: 18px;">
  Получить коммерческое предложение
</button>

<h3>Технологический стек</h3>

<p>Мы используем современные технологии, проверенные на {{company.projects}}+ проектах:</p>

<ul>
  <li><strong>Frontend:</strong> React, Vue.js, Angular, Next.js</li>
  <li><strong>Backend:</strong> Node.js, Python, Java, Go</li>
  <li><strong>Mobile:</strong> React Native, Flutter</li>
  <li><strong>Cloud:</strong> AWS, Google Cloud, Azure</li>
</ul>

<p><small>Загружено: {{loadTime}}</small></p>