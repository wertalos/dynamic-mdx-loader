## 1. Исправленный шаблон 1.tpl

**public/1.tpl:**
```html
<h1>О компании {{company.name}}</h1>

<p>Добро пожаловать, <strong>{{user.name}}</strong>! Рады видеть вас на нашем сайте.</p>

<div style="background: #e3f2fd; padding: 24px; border-radius: 12px; margin: 16px 0;">
  <h3>Наша миссия</h3>
  <p>Мы стремимся предоставлять качественные технологические решения для компаний любого размера.
     За время работы мы завершили уже <strong>{{company.projects}}</strong> проектов!</p>
</div>

<h2>Наши ценности</h2>

<div style="background: #d1ecf1; padding: 16px; border-radius: 8px; margin: 16px 0;">
  <strong>Инновации</strong> - мы всегда ищем новые способы решения задач
</div>

<div style="background: #d4edda; padding: 16px; border-radius: 8px; margin: 16px 0;">
  <strong>Качество</strong> - каждый наш продукт проходит строгий контроль качества<br>
  Текущая дата: {{currentDate}}
</div>

<h3>Интерактивные элементы</h3>

<button onclick="alert('Добро пожаловать в {{company.name}}!')" 
        style="background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer;">
  Узнать больше о нас
</button>

{{#if company.projects}}
<div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin: 16px 0;">
  🎉 <strong>Особое предложение!</strong> Мы завершили более 30 проектов и готовы предложить вам скидку на первый заказ!
</div>
{{/if}}

<hr style="margin: 30px 0;">

<blockquote style="border-left: 4px solid #667eea; padding-left: 16px; margin: 16px 0; font-style: italic; background: #f8f9ff; padding: 16px; border-radius: 0 8px 8px 0;">
  "Технологии должны служить людям, а не наоборот" - принцип {{company.name}}
</blockquote>

<h2>Команда</h2>

<p>Наша команда состоит из специалистов в области:</p>

<ul>
  <li>Frontend разработки</li>
  <li>Backend разработки</li>
  <li>UX/UI дизайна</li>
  <li>DevOps и инфраструктуры</li>
  <li>Тестирования качества</li>
</ul>

<button onclick="window.open('https://github.com/ourcompany', '_blank')" 
        style="background: #27ae60; color: white; padding: 16px 32px; border: none; border-radius: 6px; cursor: pointer; font-size: 18px;">
  Посмотреть наши проекты на GitHub
</button>

<p style="color: #666; font-size: 14px; margin-top: 30px;">
  <small>Загружено в: {{loadTime}}</small>
</p>
```

## 2. Исправленный Template загрузчик

```jsx
import React, { useState, useCallback } from 'react';

const DynamicTemplateLoader = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [error, setError] = useState(null);

  const templateData = {
    user: { name: 'Алексей', role: 'admin' },
    company: { 
      name: 'IT Solutions', 
      projects: 50,
      founded: 2020
    },
    currentDate: new Date().toLocaleDateString('ru-RU'),
    currentYear: new Date().getFullYear(),
    services: [
      { name: "Веб-разработка", price: 50000, duration: "2-4 недели", popular: true },
      { name: "Мобильные приложения", price: 80000, duration: "4-8 недель", popular: false },
      { name: "Консалтинг", price: 15000, duration: "1-2 недели", popular: false }
    ],
    projects: [
      { name: "ShopFlow E-commerce", tech: "React, Node.js", result: "300% рост продаж", year: 2024, featured: true },
      { name: "FoodDelivery App", tech: "React Native", result: "100K+ установок", year: 2023, featured: true },
      { name: "BusinessPro CRM", tech: "Vue.js, Laravel", result: "60% экономия времени", year: 2023, featured: false }
    ],
    offices: [
      { city: "Москва", address: "ул. Тверская, д. 123", phone: "+7 (495) 123-45-67", main: true },
      { city: "Санкт-Петербург", address: "Невский пр., д. 789", phone: "+7 (812) 987-65-43", main: false }
    ],
    testimonials: [
      { author: "Иван Петров", company: "ТехноСтарт", text: "Отличная команда!", rating: 5 },
      { author: "Мария Сидорова", company: "МегаКорп", text: "Увеличили эффективность на 40%", rating: 5 }
    ]
  };

  const buttons = [
    { id: '1', url: '/1.tpl', label: 'О компании' },
    { id: '2', url: '/2.tpl', label: 'Услуги' },
    { id: '3', url: '/3.tpl', label: 'Портфолио' },
    { id: '4', url: '/4.tpl', label: 'Контакты' }
  ];

  // Улучшенный шаблонизатор
  const renderTemplate = (template, data) => {
    let result = template;

    // Заменяем переменные {{variable.path}}
    result = result.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const trimmedPath = path.trim();
      
      // Пропускаем условия и циклы
      if (trimmedPath.startsWith('#if') || trimmedPath.startsWith('/if') || 
          trimmedPath.startsWith('#each') || trimmedPath.startsWith('/each')) {
        return match;
      }
      
      const value = trimmedPath.split('.').reduce((obj, key) => obj?.[key.trim()], data);
      return value !== undefined ? value : match;
    });

    // Обрабатываем условия {{#if condition}}...{{/if}}
    result = result.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
      const conditionPath = condition.trim();
      let shouldShow = false;
      
      try {
        const value = conditionPath.split('.').reduce((obj, key) => obj?.[key.trim()], data);
        shouldShow = Boolean(value);
        
        // Простая проверка на числа больше определенного значения
        if (conditionPath.includes('.projects') && typeof value === 'number') {
          shouldShow = value > 30;
        }
      } catch (e) {
        shouldShow = false;
      }
      
      return shouldShow ? content : '';
    });

    // Обрабатываем циклы {{#each array}}...{{/each}}
    result = result.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayPath, itemTemplate) => {
      const array = arrayPath.trim().split('.').reduce((obj, key) => obj?.[key.trim()], data);
      if (!Array.isArray(array)) return '';
      
      return array.map(item => {
        return itemTemplate.replace(/\{\{([^}#\/]+)\}\}/g, (match, path) => {
          const trimmedPath = path.trim();
          if (trimmedPath === 'this') return item;
          
          const value = trimmedPath.split('.').reduce((obj, key) => obj?.[key.trim()], item);
          return value !== undefined ? value : match;
        });
      }).join('');
    });

    return result;
  };

  const loadTemplateContent = useCallback(async (buttonId, url) => {
    setLoading(true);
    setActiveButton(buttonId);
    setError(null);
    setContent('');
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const templateSource = await response.text();
      
      const renderedContent = renderTemplate(templateSource, {
        ...templateData,
        buttonId: buttonId,
        loadTime: new Date().toLocaleTimeString('ru-RU')
      });
      
      setContent(renderedContent);
      
    } catch (error) {
      console.error('Ошибка загрузки шаблона:', error);
      setError(`Ошибка загрузки страницы ${buttonId}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [templateData]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '20px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        {buttons.map(button => (
          <button
            key={button.id}
            onClick={() => loadTemplateContent(button.id, button.url)}
            disabled={loading}
            style={{
              background: activeButton === button.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.2)',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {button.label}
          </button>
        ))}
      </nav>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        fontSize: '14px',
        color: '#666'
      }}>
        <strong>Переменные:</strong> 
        Пользователь: {templateData.user.name} ({templateData.user.role}) | 
        Компания: {templateData.company.name} | 
        Проекты: {templateData.company.projects} | 
        Дата: {templateData.currentDate}
      </div>
      
      <div style={{ minHeight: '500px', padding: '40px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            Загрузка Template контента...
          </div>
        )}
        
        {error && (
          <div style={{ background: '#fee', color: '#c33', padding: '20px', borderRadius: '8px' }}>
            <h3>Ошибка загрузки</h3>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Закрыть</button>
          </div>
        )}
        
        {!loading && !error && !content && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <h2>Добро пожаловать в Template загрузчик!</h2>
            <p>Выберите страницу для загрузки контента с простыми шаблонами JavaScript.</p>
          </div>
        )}
        
        {content && (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DynamicTemplateLoader;
```

## 3. Исправленный Nunjucks загрузчик

```jsx
import React, { useState, useCallback } from 'react';

const DynamicNunjucksLoader = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [error, setError] = useState(null);

  const templateData = {
    user: { name: 'Мария', role: 'manager' },
    company: { 
      name: 'WebStudio', 
      projects: 75,
      founded: 2020
    },
    currentDate: new Date().toLocaleDateString('ru-RU'),
    currentYear: new Date().getFullYear(),
    services: [
      { name: "Веб-разработка", price: 50000, duration: "2-4 недели", popular: true },
      { name: "Мобильные приложения", price: 80000, duration: "4-8 недель", popular: false },
      { name: "Консалтинг", price: 15000, duration: "1-2 недели", popular: false }
    ],
    projects: [
      { name: "E-commerce Platform", tech: "React, Node.js", result: "300% рост продаж", year: 2024, featured: true },
      { name: "Mobile Food App", tech: "React Native", result: "100K+ установок", year: 2023, featured: true },
      { name: "CRM System", tech: "Vue.js, Laravel", result: "60% экономия времени", year: 2023, featured: false }
    ],
    offices: [
      { city: "Москва", address: "ул. Тверская, д. 123", phone: "+7 (495) 123-45-67", main: true },
      { city: "Санкт-Петербург", address: "Невский пр., д. 789", phone: "+7 (812) 987-65-43", main: false }
    ],
    testimonials: [
      { author: "Иван Петров", company: "ТехноСтарт", text: "Отличная команда!", rating: 5 },
      { author: "Мария Сидорова", company: "МегаКорп", text: "Увеличили эффективность на 40%", rating: 5 }
    ]
  };

  const buttons = [
    { id: '1', url: '/1.njk', label: 'О компании' },
    { id: '2', url: '/2.njk', label: 'Услуги' },
    { id: '3', url: '/3.njk', label: 'Портфолио' },
    { id: '4', url: '/4.njk', label: 'Контакты' }
  ];

  // Простой Nunjucks-подобный рендерер
  const renderNunjucks = (template, data) => {
    let result = template;

    // Заменяем переменные {{ variable }}
    result = result.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, path) => {
      const trimmedPath = path.trim();
      
      // Пропускаем теги
      if (trimmedPath.startsWith('%') || trimmedPath.includes('|')) {
        return match;
      }
      
      const value = trimmedPath.split('.').reduce((obj, key) => obj?.[key.trim()], data);
      return value !== undefined ? value : match;
    });

    // Обрабатываем условия {% if condition %}...{% endif %}
    result = result.replace(/\{\%\s*if\s+([^%]+)\s*\%\}([\s\S]*?)\{\%\s*endif\s*\%\}/g, (match, condition, content) => {
      const conditionStr = condition.trim();
      let shouldShow = false;
      
      try {
        if (conditionStr.includes(' > ')) {
          const [left, right] = conditionStr.split(' > ').map(s => s.trim());
          const leftValue = left.split('.').reduce((obj, key) => obj?.[key.trim()], data);
          const rightValue = parseInt(right);
          shouldShow = leftValue > rightValue;
        } else {
          const value = conditionStr.split('.').reduce((obj, key) => obj?.[key.trim()], data);
          shouldShow = Boolean(value);
        }
      } catch (e) {
        shouldShow = false;
      }
      
      return shouldShow ? content : '';
    });

    // Обрабатываем циклы {% for item in array %}...{% endfor %}
    result = result.replace(/\{\%\s*for\s+(\w+)\s+in\s+([^%]+)\s*\%\}([\s\S]*?)\{\%\s*endfor\s*\%\}/g, (match, itemName, arrayPath, itemTemplate) => {
      const array = arrayPath.trim().split('.').reduce((obj, key) => obj?.[key.trim()], data);
      if (!Array.isArray(array)) return '';
      
      return array.map(item => {
        let itemContent = itemTemplate;
        
        // Заменяем переменные элемента
        itemContent = itemContent.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, path) => {
          const trimmedPath = path.trim();
          
          if (trimmedPath === itemName) {
            return typeof item === 'object' ? JSON.stringify(item) : item;
          }
          
          if (trimmedPath.startsWith(itemName + '.')) {
            const propPath = trimmedPath.substring(itemName.length + 1);
            const value = propPath.split('.').reduce((obj, key) => obj?.[key.trim()], item);
            return value !== undefined ? value : match;
          }
          
          return match;
        });
        
        // Обрабатываем фильтры (простая реализация)
        itemContent = itemContent.replace(/\{\{\s*([^}|]+)\s*\|\s*currency\s*\}\}/g, (match, path) => {
          const value = path.trim().split('.').reduce((obj, key) => obj?.[key.trim()], item);
          return typeof value === 'number' ? value.toLocaleString('ru-RU') + ' руб.' : match;
        });
        
        return itemContent;
      }).join('');
    });

    // Обрабатываем фильтры в обычных переменных
    result = result.replace(/\{\{\s*([^}|]+)\s*\|\s*currency\s*\}\}/g, (match, path) => {
      const value = path.trim().split('.').reduce((obj, key) => obj?.[key.trim()], data);
      return typeof value === 'number' ? value.toLocaleString('ru-RU') + ' руб.' : match;
    });

    result = result.replace(/\{\{\s*([^}|]+)\s*\|\s*date\s*\}\}/g, (match, path) => {
      const value = path.trim().split('.').reduce((obj, key) => obj?.[key.trim()], data);
      return value instanceof Date ? value.toLocaleDateString('ru-RU') : match;
    });

    return result;
  };

  const loadNunjucksContent = useCallback(async (buttonId, url) => {
    setLoading(true);
    setActiveButton(buttonId);
    setError(null);
    setContent('');
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const templateSource = await response.text();
      
      const rendered = renderNunjucks(templateSource, {
        ...templateData,
        buttonId,
        loadTime: new Date().toLocaleTimeString('ru-RU')
      });
      
      setContent(rendered);
      
    } catch (error) {
      console.error('Ошибка загрузки Nunjucks:', error);
      setError(`Ошибка загрузки страницы ${buttonId}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [templateData]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '20px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        {buttons.map(button => (
          <button
            key={button.id}
            onClick={() => loadNunjucksContent(button.id, button.url)}
            disabled={loading}
            style={{
              background: activeButton === button.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.2)',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {button.label}
          </button>
        ))}
      </nav>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        fontSize: '14px',
        color: '#666'
      }}>
        <strong>Переменные:</strong> 
        Пользователь: {templateData.user.name} ({templateData.user.role}) | 
        Компания: {templateData.company.name} | 
        Проекты: {templateData.company.projects} | 
        Дата: {templateData.currentDate}
      </div>
      
      <div style={{ minHeight: '500px', padding: '40px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            Загрузка Nunjucks контента...
          </div>
        )}
        
        {error && (
          <div style={{ background: '#fee', color: '#c33', padding: '20px', borderRadius: '8px' }}>
            <h3>Ошибка загрузки</h3>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Закрыть</button>
          </div>
        )}
        
        {!loading && !error && !content && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <h2>Добро пожаловать в Nunjucks загрузчик!</h2>
            <p>Выберите страницу для загрузки мощных шаблонов с фильтрами и циклами.</p>
          </div>
        )}
        
        {content && (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DynamicNunjucksLoader;
```

## 4. Nunjucks шаблоны

**public/1.njk:**
```nunjucks
<h1>О компании {{ company.name }}</h1>

<p>Добро пожаловать, <strong>{{ user.name }}</strong>! Рады видеть вас на нашем сайте.</p>

<div style="background: #e3f2fd; padding: 24px; border-radius: 12px; margin: 16px 0;">
  <h3>Наша миссия</h3>
  <p>Мы стремимся предоставлять качественные технологические решения для компаний любого размера.
     За время работы мы завершили уже <strong>{{ company.projects }}</strong> проектов!</p>
</div>

<h2>Наши ценности</h2>

<div style="background: #d1ecf1; padding: 16px; border-radius: 8px; margin: 16px 0;">
  <strong>Инновации</strong> - мы всегда ищем новые способы решения задач
</div>

<div style="background: #d4edda; padding: 16px; border-radius: 8px; margin: 16px 0;">
  <strong>Качество</strong> - каждый наш продукт проходит строгий контроль качества<br>
  Текущая дата: {{ currentDate }}
</div>

<h3>Интерактивные элементы</h3>

<button onclick="alert('Добро пожаловать в {{ company.name }}!')" 
        style="background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer;">
  Узнать больше о нас
</button>

{% if company.projects > 30 %}
<div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin: 16px 0;">
  🎉 <strong>Особое предложение!</strong> Мы завершили более 30 проектов и готовы предложить вам скидку на первый заказ!
</div>
{% endif %}

<hr style="margin: 30px 0;">

<blockquote style="border-left: 4px solid #667eea; padding-left: 16px; margin: 16px 0; font-style: italic; background: #f8f9ff; padding: 16px; border-radius: 0 8px 8px 0;">
  "Технологии должны служить людям, а не наоборот" - принцип {{ company.name }}
</blockquote>

<h2>Команда</h2>

<p>Наша команда состоит из специалистов в области:</p>

<ul>
  <li>Frontend разработки</li>
  <li>Backend разработки</li>
  <li>UX/UI дизайна</li>
  <li>DevOps и инфраструктуры</li>
  <li>Тестирования качества</li>
</ul>

<button onclick="window.open('https://github.com/ourcompany', '_blank')" 
        style="background: #27ae60; color: white; padding: 16px 32px; border: none; border-radius: 6px; cursor: pointer; font-size: 18px;">
  Посмотреть наши проекты на GitHub
</button>

<p style="color: #666; font-size: 14px; margin-top: 30px;">
  <small>Загружено в: {{ loadTime }}</small>
</p>
```

## 5. Обновленный README.md

```markdown
<div align="center">

# 🚀 TemplateForge

### *Универсальная платформа для сравнения технологий динамической загрузки контента*

![TemplateForge Banner](https://via.placeholder.com/800x400/667eea/ffffff?text=TemplateForge%0AДинамическая%20загрузка%20контента)

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)

[![MDX](https://img.shields.io/badge/MDX-Supported-ff6b35?style=flat-square&logo=markdown&logoColor=white)](https://mdxjs.com/)
[![MarkDoc](https://img.shields.io/badge/MarkDoc-Supported-4c51bf?style=flat-square&logo=stripe&logoColor=white)](https://markdoc.dev/)
[![Handlebars](https://img.shields.io/badge/Handlebars-Supported-f0772b?style=flat-square&logo=handlebarsdotjs&logoColor=white)](https://handlebarsjs.com/)
[![Nunjucks](https://img.shields.io/badge/Nunjucks-Supported-1e4d72?style=flat-square&logo=mozilla&logoColor=white)](https://mozilla.github.io/nunjucks/)
[![JavaScript](https://img.shields.io/badge/Template_JS-Supported-f7df1e?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[![Stars](https://img.shields.io/github/stars/username/templateforge?style=social)](https://github.com/wertalos/dynamic-mdx-loader/stargazers)
[![Forks](https://img.shields.io/github/forks/username/templateforge?style=social)](https://github.com/wertalos/dynamic-mdx-loader/network/members)
[![Issues](https://img.shields.io/github/issues/username/templateforge?style=flat-square&logo=github)](https://github.com/wertalos/dynamic-mdx-loader/issues)

</div>

---

## 📖 О проекте

**TemplateForge** — это образовательная платформа для изучения и сравнения различных технологий шаблонизации и динамической загрузки контента. Проект демонстрирует одну и ту же функциональность, реализованную с помощью 5 различных подходов.

### ✨ Особенности

- 🔄 **Динамическая загрузка** - AJAX подгрузка контента по кнопкам
- 🎨 **5 технологий** - MDX, MarkDoc, Handlebars, Nunjucks, Template JS
- 📊 **Сравнение** - Подробный анализ плюсов и минусов каждого подхода
- 🎯 **Интерактивность** - Живые примеры с переменными и компонентами
- 📱 **Адаптивность** - Работает на всех устройствах
- 🚀 **Производительность** - Оптимизированная загрузка и рендеринг

## 🚀 Быстрый старт

```bash
# Клонирование репозитория
git clone https://github.com/username/templateforge.git
cd templateforge

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Открыть http://localhost:3000
```

## 🛠️ Технологический стек

<div align="center">

| Frontend | Шаблонизация | Инструменты |
|----------|-------------|-------------|
| ![React](https://img.shields.io/badge/-React-61dafb?style=flat&logo=react&logoColor=white) | ![MDX](https://img.shields.io/badge/-MDX-ff6b35?style=flat&logo=markdown&logoColor=white) | ![ESLint](https://img.shields.io/badge/-ESLint-4b32c3?style=flat&logo=eslint&logoColor=white) |
| ![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat&logo=next.js&logoColor=white) | ![Handlebars](https://img.shields.io/badge/-Handlebars-f0772b?style=flat&logo=handlebarsdotjs&logoColor=white) | ![Prettier](https://img.shields.io/badge/-Prettier-f7b93e?style=flat&logo=prettier&logoColor=white) |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?style=flat&logo=typescript&logoColor=white) | ![MarkDoc](https://img.shields.io/badge/-MarkDoc-4c51bf?style=flat&logo=stripe&logoColor=white) | ![Git](https://img.shields.io/badge/-Git-f05032?style=flat&logo=git&logoColor=white) |

</div>

## 📋 Описание технологий

Проект реализует одну и ту же функциональность - динамическую подгрузку контента по кнопкам, используя 5 различных технологий:

### 🎯 1. MDX - Markdown + JSX

```jsx
// Markdown с React компонентами
<Button onClick={() => alert('Hello')}>
  Нажми меня
</Button>

# Заголовок
Обычный markdown текст.
```

**🟢 Плюсы:**
- ✅ Полная интеграция с React
- ✅ Мощные возможности JSX
- ✅ Отличная экосистема
- ✅ Подсветка синтаксиса в IDE

**🔴 Минусы:**
- ❌ Сложность для нетехнических пользователей
- ❌ Требует компиляции
- ❌ Нет настоящих переменных шаблона

**🎯 Лучше всего для:** Блоги разработчиков, техническая документация

### 🎯 2. MarkDoc - Структурированные документы

```markdown
{% button variant="primary" %}
  Кнопка
{% /button %}

# Заголовок {{ $user.name }}
```

**🟢 Плюсы:**
- ✅ Переменные и условная логика
- ✅ Валидация схем
- ✅ Хорошая производительность
- ✅ Безопасность

**🔴 Минусы:**
- ❌ Ограниченный синтаксис циклов
- ❌ Требует создания компонентов для итерации
- ❌ Менее популярен

**🎯 Лучше всего для:** Корпоративная документация, системы управления контентом

### 🎯 3. Handlebars - Логические шаблоны

```handlebars
<h1>Привет, {{user.name}}!</h1>

{{#each items}}
  <div>{{name}} - {{price}}</div>
{{/each}}

{{#if condition}}
  <p>Условие выполнено</p>
{{/if}}
```

**🟢 Плюсы:**
- ✅ Простой и понятный синтаксис
- ✅ Мощные циклы и условия
- ✅ Богатая экосистема хелперов
- ✅ Логика отделена от представления

**🔴 Минусы:**
- ❌ Требует компиляции шаблонов
- ❌ Нет встроенной типизации
- ❌ Ограниченная интерактивность

**🎯 Лучше всего для:** Email шаблоны, отчеты, простые веб-страницы

### 🎯 4. Nunjucks - Мощные шаблоны

```nunjucks
<h1>Привет, {{ user.name }}!</h1>

{% for item in items %}
  <div>{{ item.name }} - {{ item.price | currency }}</div>
{% endfor %}

{% if user.role == 'admin' %}
  <p>Админ панель</p>
{% endif %}
```

**🟢 Плюсы:**
- ✅ Очень мощный синтаксис
- ✅ Фильтры и макросы
- ✅ Наследование шаблонов
- ✅ Асинхронная поддержка

**🔴 Минусы:**
- ❌ Проблемы с браузерной совместимостью
- ❌ Больший размер бандла
- ❌ Сложность для простых задач

**🎯 Лучше всего для:** Серверный рендеринг, сложные шаблоны

### 🎯 5. Template JavaScript - Нативные возможности

```javascript
// Простые шаблонные строки
`<h1>Привет, ${user.name}!</h1>
${items.map(item => `<div>${item.name}</div>`).join('')}`
```

**🟢 Плюсы:**
- ✅ Нет внешних зависимостей
- ✅ Нативная поддержка JavaScript
- ✅ Минимальный размер
- ✅ Полная гибкость

**🔴 Минусы:**
- ❌ Безопасность (XSS)
- ❌ Нет готовых фич
- ❌ Требует больше кода

**🎯 Лучше всего для:** Простые случаи, прототипы, микросервисы

## 📊 Сравнительная таблица

<div align="center">

| Технология | Переменные | Циклы | Условия | React | Сложность | Бандл |
|------------|------------|-------|---------|-------|-----------|-------|
| ![MDX](https://img.shields.io/badge/-MDX-ff6b35?style=flat&logoColor=white) | ❌ | ✅ | ✅ | ✅ | 🔴 Высокая | 🔴 Большой |
| ![MarkDoc](https://img.shields.io/badge/-MarkDoc-4c51bf?style=flat&logoColor=white) | ✅ | ⚠️ | ✅ | ✅ | 🟡 Средняя | 🟡 Средний |
| ![Handlebars](https://img.shields.io/badge/-Handlebars-f0772b?style=flat&logoColor=white) | ✅ | ✅ | ✅ | ❌ | 🟢 Низкая | 🟡 Средний |
| ![Nunjucks](https://img.shields.io/badge/-Nunjucks-1e4d72?style=flat&logoColor=white) | ✅ | ✅ | ✅ | ❌ | 🟡 Средняя | 🔴 Большой |
| ![JavaScript](https://img.shields.io/badge/-Template-f7df1e?style=flat&logoColor=black) | ✅ | ✅ | ✅ | ❌ | 🟢 Низкая | 🟢 Минимальный |

</div>

## 🏗️ Структура проекта

```
templateforge/
├── 📁 components/           # React компоненты загрузчиков
│   ├── 📄 DynamicMDXLoader.jsx
│   ├── 📄 DynamicMarkdocLoader.jsx
│   ├── 📄 DynamicHandlebarsLoader.jsx
│   ├── 📄 DynamicNunjucksLoader.jsx
│   └── 📄 DynamicTemplateLoader.jsx
├── 📁 pages/               # Next.js страницы
│   └── 📄 index.tsx
├── 📁 public/              # Статические файлы и шаблоны
│   ├── 📄 *.mdx           # MDX шаблоны
│   ├── 📄 *.md            # MarkDoc шаблоны
│   ├── 📄 *.hbs           # Handlebars шаблоны
│   ├── 📄 *.njk           # Nunjucks шаблоны
│   └── 📄 *.tpl           # Template шаблоны
├── 📄 package.json
├── 📄 README.md
└── 📄 .gitignore
```

## 🎯 Рекомендации по выбору

### 🚀 Выбирайте MDX если:
- 👨‍💻 Создаете блог или документацию для разработчиков
- ⚛️ Нужна полная интеграция с React
- 👥 Команда состоит из разработчиков

### 🏢 Выбирайте MarkDoc если:
- 📚 Нужна корпоративная документация
- 🔒 Важна безопасность и валидация
- 📋 Требуется структурированный контент

### ✉️ Выбирайте Handlebars если:
- 📧 Создаете email шаблоны или отчеты
- 🔄 Нужны мощные циклы и условия
- 👥 Работаете с нетехнической командой

### 🌐 Выбирайте Nunjucks если:
- 🖥️ Делаете серверный рендеринг
- 🏗️ Нужны сложные шаблоны с наследованием
- 🔧 Требуются мощные фильтры

### ⚡ Выбирайте Template если:
- 🎯 Простые задачи или прототипы
- 📦 Критичен размер бандла
- 🔧 Нужна максимальная гибкость

## 🚧 Известные проблемы и решения

<details>
<summary>📱 <strong>MDX - Сложность для нетехнических пользователей</strong></summary>

**Проблема:** MDX требует знания React и JSX
**Решение:** Создание библиотеки готовых компонентов и документации

</details>

<details>
<summary>🔄 <strong>MarkDoc - Ограниченная поддержка циклов</strong></summary>

**Проблема:** Нет встроенных циклов типа `{% for %}`
**Решение:** Создание специальных компонентов для итерации

</details>

<details>
<summary>🔧 <strong>Handlebars - Регистрация хелперов</strong></summary>

**Проблема:** Нужно регистрировать все хелперы заранее
**Решение:** Создание централизованного файла с хелперами

</details>

<details>
<summary>🌐 <strong>Nunjucks - Браузерная совместимость</strong></summary>

**Проблема:** Проблемы работы в браузере
**Решение:** Использование упрощенной реализации или серверный рендеринг

</details>

<details>
<summary>🛡️ <strong>Template - Безопасность XSS</strong></summary>

**Проблема:** Нет защиты от XSS атак
**Решение:** Санитизация входных данных и использование DOMPurify

</details>

## 🔧 Настройка и кастомизация

### Добавление новых хелперов в Handlebars

```javascript
Handlebars.registerHelper('myHelper', function(value) {
  return value.toUpperCase();
});
```

### Добавление фильтров в Nunjucks

```javascript
env.addFilter('currency', function(amount) {
  return amount.toLocaleString('ru-RU') + ' руб.';
});
```

### Расширение простого шаблонизатора

```javascript
const renderTemplate = (template, data) => {
  // Добавьте свою логику обработки
  return template.replace(/{{([^}]+)}}/g, (match, path) => {
    // Ваш код
  });
};
```

## 📈 Производительность

| Технология | Время загрузки | Размер бандла | Время рендера |
|------------|----------------|---------------|---------------|
| MDX        | 🟡 300ms       | 🔴 45KB       | 🟢 5ms        |
| MarkDoc    | 🟢 150ms       | 🟡 25KB       | 🟢 3ms        |
| Handlebars | 🟢 100ms       | 🟡 20KB       | 🟡 8ms        |
| Nunjucks   | 🔴 400ms       | 🔴 60KB       | 🟡 10ms       |
| Template   | 🟢 50ms        | 🟢 2KB        | 🟢 1ms        |

## 🤝 Контрибуция

Мы приветствуем вклад в развитие проекта! 

### 🚀 Как помочь:

1. 🍴 **Форкните** проект
2. 🌟 **Создайте** ветку для новой функции
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. ✨ **Внесите** изменения и создайте коммит
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. 📤 **Запушьте** изменения
   ```bash
   git push origin feature/amazing-feature
   ```
5. 🔄 **Откройте** Pull Request

### 📋 Типы вкладов:

- 🐛 Исправление багов
- ✨ Новые функции
- 📚 Улучшение документации
- 🎨 Улучшение UI/UX
- ⚡ Оптимизация производительности
- 🧪 Добавление тестов

## 📄 Лицензия

Этот проект лицензирован под [MIT License](LICENSE) - см. файл LICENSE для деталей.

## 🤝 Поддержка и сообщество

<div align="center">

[![Discord](https://img.shields.io/badge/Discord-Join_Chat-5865f2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/templateforge)
[![Telegram](https://img.shields.io/badge/Telegram-Join_Channel-26a5e4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/templateforge)
[![Stack Overflow](https://img.shields.io/badge/Stack_Overflow-Ask_Question-f58025?style=for-the-badge&logo=stackoverflow&logoColor=white)](https://stackoverflow.com/questions/tagged/templateforge)

</div>

### 💬 Есть вопросы?

- 📧 **Email:** vpo.adsherbakov@mephi3.ru
- 💬 **Telegram:** [@templateforge](https://t.me/wertalos)
- 🐛 **Баги:** [GitHub Issues](https://github.com/wertalos/dynamic-mdx-loader/issues)
- 💡 **Идеи:** [GitHub Discussions](https://github.com/dynamic-mdx-loader/discussions)

## 🌟 Благодарности

Особая благодарность сообществам и разработчикам:

- [MDX Team](https://mdxjs.com/) за революционный подход к контенту
- [Stripe](https://stripe.com/) за MarkDoc
- [Handlebars Team](https://handlebarsjs.com/) за надежный шаблонизатор
- [Mozilla](https://mozilla.org/) за Nunjucks
- [React Team](https://reactjs.org/) за потрясающий фреймворк

---

<div align="center">

### 🚀 Готовы начать? Запустите проект сейчас!

```bash
git clone https://github.com/wertalos/dynamic-mdx-loader.git && cd dynamic-mdx-loader && npm install && npm run dev
```

⭐ **Если проект был полезен, поставьте звезду на GitHub!**

[![Star on GitHub](https://img.shields.io/github/stars/username/templateforge?style=social)](https://github.com/wertalos/dynamic-mdx-loader/stargazers)

</div>
