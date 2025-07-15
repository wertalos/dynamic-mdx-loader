<h1>Контакты {{company.name}}</h1>

<p>Здравствуйте, <strong>{{user.name}}</strong>! Свяжитесь с нами.</p>

<h2>Наши офисы</h2>

{{#each offices}}
<div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin: 16px 0; border: 1px solid #e9ecef;">
  <h3>📍 {{city}}</h3>
  <p><strong>Адрес:</strong> {{address}}</p>
  <p><strong>Телефон:</strong> {{phone}}</p>
  
  <button onclick="alert('Маршрут до {{city}} построен!')" 
          style="background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer;">
    На карте
  </button>
</div>
{{/each}}

<h2>Форма связи</h2>

<div style="background: #d1ecf1; color: #0c5460; padding: 16px; border-radius: 8px; margin: 16px 0;">
  Заполните форму, и мы свяжемся с вами в течение 24 часов!
</div>

<div style="background: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e9ecef;">
  <h3>✉️ Напишите нам</h3>
  
  <button onclick="alert('Сообщение от {{user.name}} отправлено!')" 
          style="background: #27ae60; color: white; padding: 15px 30px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">
    Отправить сообщение
  </button>
</div>

<h2>Социальные сети</h2>

<p>Следите за новостями {{company.name}}:</p>

<div style="display: flex; gap: 12px; flex-wrap: wrap;">
  <button onclick="window.open('https://t.me/ourcompany', '_blank')" 
          style="background: #0088cc; color: white; padding: 12px 20px; border: none; border-radius: 6px; cursor: pointer;">
    📱 Telegram
  </button>
  <button onclick="window.open('https://github.com/ourcompany', '_blank')" 
          style="background: #333; color: white; padding: 12px 20px; border: none; border-radius: 6px; cursor: pointer;">
    💻 GitHub
  </button>
</div>

<h2>Быстрая связь</h2>

<div style="background: #fff3cd; color: #856404; padding: 16px; border-radius: 8px; margin: 16px 0;">
  <strong>Горячая линия:</strong> +7 (800) 123-45-67
</div>

<p style="color: #666; font-size: 14px;">
  <strong>Дата:</strong> {{currentDate}} | <strong>Время:</strong> {{loadTime}}
</p>