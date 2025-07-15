<h1>Портфолио {{company.name}}</h1>

<p>Добро пожаловать в наше портфолио, <strong>{{user.name}}</strong>!</p>

<div style="background: #d4edda; color: #155724; padding: 16px; border-radius: 8px; margin: 16px 0;">
  За последний год мы завершили <strong>{{company.projects}}+ проектов</strong> и получили высокие оценки!
</div>

<h2>Наши проекты</h2>

{{#each projects}}
<div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin: 16px 0; border: 1px solid #e9ecef;">
  <h3>{{name}} ({{year}})</h3>
  <p><strong>Технологии:</strong> {{tech}}</p>
  <p><strong>Результат:</strong> {{result}}</p>
  
  <button onclick="alert('Проект {{name}} - один из наших лучших!')" 
          style="background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer;">
    Подробнее
  </button>
</div>
{{/each}}

<h2>Статистика</h2>

<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 16px 0;">
  <p>Всего проектов: <strong>{{company.projects}}</strong></p>
  <p>Опыт работы: <strong>4 года</strong></p>
  <p>Довольных клиентов: <strong>95%</strong></p>
</div>

{{#if company.projects}}
<div style="background: #fff3cd; color: #856404; padding: 16px; border-radius: 8px; margin: 16px 0;">
  🏆 <strong>Достижение!</strong> Мы завершили множество проектов и готовы к новым вызовам!
</div>
{{/if}}

<button onclick="alert('Спасибо за интерес к {{company.name}}!')" 
        style="background: #27ae60; color: white; padding: 16px 32px; border: none; border-radius: 6px; cursor: pointer; font-size: 18px;">
  Стать клиентом
</button>

<hr>

<p style="color: #666; font-size: 14px;">
  <strong>Обновлено:</strong> {{currentDate}} | 
  <strong>Просматривает:</strong> {{user.name}} | 
  <strong>Загружено:</strong> {{loadTime}}
</p>