Вот полный пример реализации динамической подгрузки MDX содержимого:

## 1. React компонент с MDX загрузчиком

```jsx
import React, { useState, useCallback } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

const DynamicMDXLoader = () => {
  const [mdxSource, setMdxSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [error, setError] = useState(null);

  const buttons = [
    { id: '1', url: '/1.mdx', label: 'О компании' },
    { id: '2', url: '/2.mdx', label: 'Услуги' },
    { id: '3', url: '/3.mdx', label: 'Портфолио' },
    { id: '4', url: '/4.mdx', label: 'Контакты' }
  ];

  const loadMDXContent = useCallback(async (buttonId, url) => {
    setLoading(true);
    setActiveButton(buttonId);
    setError(null);
    
    // Очищаем рабочую область
    setMdxSource(null);
    
    try {
      // AJAX запрос для загрузки MDX файла
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const mdxContent = await response.text();
      
      // Преобразуем MDX в сериализованный формат
      const serialized = await serialize(mdxContent, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight],
        },
      });
      
      // Загружаем контент в рабочую область
      setMdxSource(serialized);
      
    } catch (error) {
      console.error('Ошибка загрузки MDX:', error);
      setError(`Ошибка загрузки страницы ${buttonId}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="mdx-container">
      <style jsx>{`
        .mdx-container {
          max-width: 1200px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .navigation {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .nav-button {
          background: rgba(255,255,255,0.1);
          color: white;
          border: 2px solid rgba(255,255,255,0.2);
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .nav-button:hover {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.4);
          transform: translateY(-2px);
        }
        
        .nav-button.active {
          background: rgba(255,255,255,0.3);
          border-color: rgba(255,255,255,0.6);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .nav-button.loading {
          background: rgba(255,255,255,0.1);
          cursor: not-allowed;
          opacity: 0.6;
        }
        
        .content-area {
          min-height: 500px;
          padding: 40px;
          position: relative;
        }
        
        .loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: #666;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error {
          background: #fee;
          color: #c33;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #e74c3c;
          margin: 20px 0;
        }
        
        .initial-content {
          text-align: center;
          color: #666;
          padding: 60px 20px;
        }
        
        .initial-content h2 {
          color: #333;
          margin-bottom: 16px;
        }
      `}</style>
      
      <nav className="navigation">
        {buttons.map(button => (
          <button
            key={button.id}
            id={button.id}
            className={`nav-button ${activeButton === button.id ? 'active' : ''} ${loading ? 'loading' : ''}`}
            onClick={() => loadMDXContent(button.id, button.url)}
            disabled={loading}
          >
            {button.label}
          </button>
        ))}
      </nav>
      
      <div className="content-area">
        {loading && (
          <div className="loader">
            <div className="spinner"></div>
            <p>Загрузка MDX контента...</p>
          </div>
        )}
        
        {error && (
          <div className="error">
            <h3>Ошибка загрузки</h3>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Закрыть</button>
          </div>
        )}
        
        {!loading && !error && !mdxSource && (
          <div className="initial-content">
            <h2>Добро пожаловать в MDX загрузчик!</h2>
            <p>Выберите страницу для загрузки интерактивного контента.</p>
          </div>
        )}
        
        {mdxSource && !loading && !error && (
          <MDXContent source={mdxSource} />
        )}
      </div>
    </div>
  );
};

// Компонент для рендеринга MDX контента
const MDXContent = ({ source }) => {
  const components = {
    // Кастомные компоненты для MDX
    Button: ({ children, variant = 'primary', onClick }) => (
      <button
        onClick={onClick}
        style={{
          background: variant === 'primary' ? '#667eea' : variant === 'success' ? '#27ae60' : '#95a5a6',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
          margin: '8px 4px',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.opacity = '0.8'}
        onMouseOut={(e) => e.target.style.opacity = '1'}
      >
        {children}
      </button>
    ),
    
    Card: ({ title, children, color = '#f8f9fa' }) => (
      <div style={{
        background: color,
        padding: '24px',
        borderRadius: '12px',
        margin: '16px 0',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {title && <h3 style={{ marginTop: 0, color: '#333' }}>{title}</h3>}
        {children}
      </div>
    ),
    
    Alert: ({ type = 'info', children }) => {
      const colors = {
        info: { bg: '#d1ecf1', border: '#17a2b8', text: '#0c5460' },
        success: { bg: '#d4edda', border: '#28a745', text: '#155724' },
        warning: { bg: '#fff3cd', border: '#ffc107', text: '#856404' },
        danger: { bg: '#f8d7da', border: '#dc3545', text: '#721c24' }
      };
      
      return (
        <div style={{
          background: colors[type].bg,
          color: colors[type].text,
          padding: '16px',
          borderRadius: '8px',
          border: `1px solid ${colors[type].border}`,
          borderLeft: `4px solid ${colors[type].border}`,
          margin: '16px 0'
        }}>
          {children}
        </div>
      );
    },
    
    Counter: () => {
      const [count, setCount] = React.useState(0);
      return (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          background: '#f8f9fa',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <button 
            onClick={() => setCount(count - 1)}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer'
            }}
          >
            -
          </button>
          <span style={{ fontSize: '18px', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>
            {count}
          </span>
          <button 
            onClick={() => setCount(count + 1)}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer'
            }}
          >
            +
          </button>
        </div>
      );
    },
    
    // Стилизованные HTML элементы
    h1: (props) => <h1 style={{ color: '#667eea', borderBottom: '3px solid #667eea', paddingBottom: '8px' }} {...props} />,
    h2: (props) => <h2 style={{ color: '#333', marginTop: '32px' }} {...props} />,
    h3: (props) => <h3 style={{ color: '#555' }} {...props} />,
    blockquote: (props) => (
      <blockquote style={{
        borderLeft: '4px solid #667eea',
        paddingLeft: '16px',
        margin: '16px 0',
        fontStyle: 'italic',
        background: '#f8f9ff',
        padding: '16px',
        borderRadius: '0 8px 8px 0'
      }} {...props} />
    ),
    code: (props) => (
      <code style={{
        background: '#f1f3f4',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '14px',
        fontFamily: 'Monaco, Consolas, monospace'
      }} {...props} />
    )
  };

  return (
    <div className="mdx-content">
      <MDXRemote {...source} components={components} />
    </div>
  );
};

export default DynamicMDXLoader;
```

## 2. Примеры MDX файлов

**1.mdx (О компании):**
```mdx
# О нашей компании

Добро пожаловать в **инновационную IT компанию**, которая создает будущее уже сегодня!

<Card title="Наша миссия" color="#e3f2fd">
Мы стремимся предоставлять качественные технологические решения, которые делают жизнь людей лучше и бизнес более эффективным.
</Card>

## Наши ценности

<Alert type="info">
**Инновации** - мы всегда ищем новые способы решения задач
</Alert>

<Alert type="success">
**Качество** - каждый наш продукт проходит строгий контроль качества
</Alert>

<Alert type="warning">
**Клиентоориентированность** - потребности клиентов - наш главный приоритет
</Alert>

### Интерактивный счетчик наших достижений

Проекты завершены: <Counter />

<Button onClick={() => alert('Спасибо за интерес к нашей компании!')}>
  Узнать больше
</Button>

---

> "Технологии должны служить людям, а не наоборот" - наш основной принцип

## Команда

Наша команда состоит из `50+ специалистов` в области:

- Frontend разработки
- Backend разработки  
- UX/UI дизайна
- DevOps и инфраструктуры
- Тестирования качества

```javascript
const ourTeam = {
  developers: 30,
  designers: 10,
  managers: 8,
  qa: 7
};

console.log(`Общая команда: ${Object.values(ourTeam).reduce((a, b) => a + b)} человек`);
```
```

**2.mdx (Услуги):**
```mdx
# Наши услуги

Мы предлагаем полный спектр IT-услуг для развития вашего бизнеса.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', margin: '20px 0'}}>

<Card title="🌐 Веб-разработка">
- Современные SPA приложения
- E-commerce платформы  
- Корпоративные сайты
- PWA приложения

<Button variant="primary">Заказать</Button>
</Card>

<Card title="📱 Мобильные приложения">
- Native iOS/Android
- React Native
- Flutter приложения
- Гибридные решения

<Button variant="primary">Заказать</Button>
</Card>

<Card title="☁️ Облачные решения">
- Миграция в облако
- Serverless архитектура
- Контейнеризация
- CI/CD настройка

<Button variant="primary">Заказать</Button>
</Card>

</div>

## Процесс работы

<Alert type="info">
**Этап 1:** Анализ требований и планирование
</Alert>

<Alert type="warning">  
**Этап 2:** Дизайн и прототипирование
</Alert>

<Alert type="success">
**Этап 3:** Разработка и тестирование
</Alert>

<Alert type="danger">
**Этап 4:** Деплой и поддержка
</Alert>

### Калькулятор стоимости

Примерная стоимость проекта: <Counter /> × 1000$ = **{count * 1000}$**

<Button onClick={() => alert('Свяжитесь с нами для точного расчета!')}>
  Получить коммерческое предложение
</Button>

## Технологии

```typescript
interface OurStack {
  frontend: string[];
  backend: string[];
  mobile: string[];
  cloud: string[];
}

const technologies: OurStack = {
  frontend: ['React', 'Vue.js', 'Angular', 'Next.js'],
  backend: ['Node.js', 'Python', 'Java', 'Go'],
  mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
  cloud: ['AWS', 'Google Cloud', 'Azure', 'Docker']
};
```

> Мы используем только проверенные и современные технологии для создания надежных решений.
```

**3.mdx (Портфолио):**
```mdx
# Портфолио проектов

Ознакомьтесь с нашими успешными реализациями и достижениями.

<Alert type="success">
За последний год мы завершили **50+ проектов** и получили высокие оценки от клиентов!
</Alert>

## Крупные проекты

<Card title="🛒 E-commerce платформа 'ShopFlow'" color="#fff3cd">

**Описание:** Полнофункциональный интернет-магазин с системой управления заказами

**Технологии:** React, Node.js, PostgreSQL, Redis

**Результат:** Увеличение продаж на 300%

<Button onClick={() => alert('Демо недоступно по соглашению о конфиденциальности')}>
  Посмотреть демо
</Button>

</Card>

<Card title="📱 Мобильное приложение 'FoodDelivery'" color="#d4edda">

**Описание:** Приложение для доставки еды с геолокацией и онлайн-оплатой

**Технологии:** React Native, Express.js, MongoDB

**Результат:** 100,000+ установок за первый месяц

<Button variant="success" onClick={() => alert('Приложение доступно в App Store и Google Play')}>
  Скачать приложение
</Button>

</Card>

<Card title="💼 CRM система 'BusinessPro'" color="#d1ecf1">

**Описание:** Комплексная система управления взаимоотношениями с клиентами

**Технологии:** Vue.js, Laravel, MySQL

**Результат:** Сокращение времени обработки заявок на 60%

<Button onClick={() => alert('Свяжитесь с нами для получения доступа к демо')}>
  Запросить демо
</Button>

</Card>

## Статистика проектов

Интерактивный счетчик завершенных проектов: <Counter />

### Распределение по типам

```javascript
const projectStats = {
  'Веб-приложения': 35,
  'Мобильные приложения': 20,
  'CRM/ERP системы': 15,
  'E-commerce': 25,
  'Другое': 5
};

// Общее количество проектов
const totalProjects = Object.values(projectStats)
  .reduce((sum, count) => sum + count, 0);

console.log(`Всего проектов: ${totalProjects}`);
```

<Alert type="info">
Каждый проект уникален и создается с учетом специфики бизнеса клиента
</Alert>

## Отзывы клиентов

> "Отличная команда профессионалов! Проект был выполнен в срок и превзошел все ожидания."
> 
> — **Иван Петров**, директор ООО "ТехноСтарт"

> "Благодаря новой CRM системе мы смогли увеличить эффективность работы на 40%. Рекомендуем!"
> 
> — **Мария Сидорова**, руководитель отдела продаж "МегаКорп"

<Button variant="success" onClick={() => alert('Будем рады работать и с вами!')}>
  Стать нашим клиентом
</Button>
```

**4.mdx (Контакты):**
```mdx
# Контакты

Свяжитесь с нами удобным для вас способом!

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', margin: '30px 0'}}>

<Card title="📍 Офис в Москве">
**Адрес:** г. Москва, ул. Тверская, д. 123, офис 456

**Телефон:** +7 (495) 123-45-67

**Email:** moscow@example.com

**Время работы:** Пн-Пт 9:00-18:00

<Button onClick={() => alert('Построить маршрут в Яндекс.Картах')}>
  Показать на карте
</Button>
</Card>

<Card title="📍 Офис в СПб">
**Адрес:** г. Санкт-Петербург, Невский пр., д. 789

**Телефон:** +7 (812) 987-65-43

**Email:** spb@example.com

**Время работы:** Пн-Пт 10:00-19:00

<Button onClick={() => alert('Построить маршрут в Яндекс.Картах')}>
  Показать на карте
</Button>
</Card>

</div>

## Форма обратной связи

<Alert type="info">
Заполните форму ниже, и мы свяжемся с вами в течение 24 часов!
</Alert>

<Card title="✉️ Напишите нам">

**Имя:** <input type="text" style={{width: '100%', padding: '8px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px'}} placeholder="Ваше имя" />

**Email:** <input type="email" style={{width: '100%', padding: '8px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px'}} placeholder="your@email.com" />

**Тема:** <select style={{width: '100%', padding: '8px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px'}}>
  <option>Веб-разработка</option>
  <option>Мобильные приложения</option>
  <option>Консультации</option>
  <option>Другое</option>
</select>

**Сообщение:** <textarea style={{width: '100%', height: '120px', padding: '8px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical'}} placeholder="Опишите ваш проект..."></textarea>

<Button variant="success" onClick={() => alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.')}>
  Отправить сообщение
</Button>

</Card>

## Социальные сети

Следите за нашими новостями и обновлениями:

<div style={{display: 'flex', gap: '10px', margin: '20px 0'}}>
  <Button onClick={() => window.open('https://t.me/ourcompany', '_blank')}>
    📱 Telegram
  </Button>
  <Button onClick={() => window.open('https://vk.com/ourcompany', '_blank')}>
    🎵 VKontakte
  </Button>
  <Button onClick={() => window.open('https://github.com/ourcompany', '_blank')}>
    💻 GitHub
  </Button>
</div>

## Быстрая связь

Нужна срочная консультация? <Counter /> звонков сегодня!

<Alert type="warning">
**Горячая линия:** +7 (800) 123-45-67 (бесплатно по России)
</Alert>

```javascript
// Время работы поддержки
const supportHours = {
  monday: '9:00-21:00',
  tuesday: '9:00-21:00', 
  wednesday: '9:00-21:00',
  thursday: '9:00-21:00',
  friday: '9:00-21:00',
  saturday: '10:00-16:00',
  sunday: 'выходной'
};

const today = new Date().toLocaleDateString('ru', {weekday: 'long'});
console.log(`Сегодня поддержка работает: ${supportHours[today] || 'уточняйте'}`);
```

<Button variant="danger" onClick={() => alert('Функция в разработке')}>
  🚨 Экстренная связь
</Button>
```

## 3. Установка зависимостей

```bash
npm install next-mdx-remote remark-gfm rehype-highlight highlight.js
```

## 4. Альтернативный подход с @mdx-js/react

```jsx
import React, { useState } from 'react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

const AlternativeMDXLoader = () => {
  const [MDXContent, setMDXContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadMDX = async (url) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const mdxSource = await response.text();
      
      const { default: Content } = await evaluate(mdxSource, {
        ...runtime,
        useMDXComponents: () => ({
          Button: ({ children, onClick }) => (
            <button onClick={onClick} style={{padding: '8px 16px', margin: '4px'}}>
              {children}
            </button>
          )
        })
      });
      
      setMDXContent(() => Content);
    } catch (error) {
      console.error('Error loading MDX:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navigation buttons */}
      <nav>
        <button onClick={() => loadMDX('/1.mdx')}>Page 1</button>
        <button onClick={() => loadMDX('/2.mdx')}>Page 2</button>
        <button onClick={() => loadMDX('/3.mdx')}>Page 3</button>
        <button onClick={() => loadMDX('/4.mdx')}>Page 4</button>
      </nav>
      
      {/* Content area */}
      <div>
        {loading && <p>Loading...</p>}
        {MDXContent && <MDXContent />}
      </div>
    </div>
  );
};
```

Этот пример полностью реализует требования задания с использованием MDX, включая интерактивные React компоненты внутри Markdown контента.

# Написать package.json для запуска примера реализации динамической подгрузки MDX содержимого

Вот полный `package.json` для запуска примера с динамической подгрузкой MDX содержимого:

## package.json

```json
{
  "name": "dynamic-mdx-loader",
  "version": "1.0.0",
  "description": "Динамическая подгрузка MDX содержимого с React компонентами",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "serve": "serve public -p 3001",
    "dev:static": "concurrently \"npm run serve\" \"npm run dev\""
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next-mdx-remote": "^4.4.1",
    "remark-gfm": "^3.0.1",
    "rehype-highlight": "^6.0.0",
    "highlight.js": "^11.9.0",
    "gray-matter": "^4.0.3",
    "remark": "^15.0.1",
    "rehype": "^13.0.1"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "typescript": "^5.0.0",
    "concurrently": "^8.2.0",
    "serve": "^14.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

## Альтернативный package.json для Create React App

Если вы предпочитаете использовать Create React App вместо Next.js:

```json
{
  "name": "dynamic-mdx-loader-cra",
  "version": "1.0.0",
  "description": "Динамическая подгрузка MDX содержимого на React",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "@mdx-js/mdx": "^2.3.0",
    "@mdx-js/react": "^2.3.0",
    "remark-gfm": "^3.0.1",
    "rehype-highlight": "^6.0.0",
    "highlight.js": "^11.9.0",
    "gray-matter": "^4.0.3",
    "unified": "^11.0.0",
    "remark-parse": "^11.0.0",
    "remark-rehype": "^11.0.0",
    "rehype-stringify": "^10.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "concurrently": "^8.2.0",
    "serve": "^14.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "serve:mdx": "serve public/mdx -p 3001 --cors",
    "dev": "concurrently \"npm run serve:mdx\" \"npm start\""
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:3001"
}
```

## Дополнительные файлы конфигурации

### next.config.js (для Next.js версии)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/:path*.mdx',
        destination: '/api/mdx/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### tsconfig.json (опционально для TypeScript)

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "es6"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src",
    "pages",
    "components",
    "types"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### tailwind.config.js (опционально для стилей)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## Структура проекта

```
dynamic-mdx-loader/
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── public/
│   ├── 1.mdx
│   ├── 2.mdx
│   ├── 3.mdx
│   └── 4.mdx
├── pages/ (для Next.js)
│   ├── index.tsx
│   └── api/
│       └── mdx/
│           └── [...slug].ts
├── src/ (для CRA)
│   ├── App.tsx
│   ├── components/
│   │   └── DynamicMDXLoader.tsx
│   └── index.tsx
└── styles/
    └── globals.css
```

## Команды для установки и запуска

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка продакшн версии
npm run build

# Запуск продакшн сервера
npm start

# Только для CRA - запуск с сервером для MDX файлов
npm run dev
```

## API роут для обслуживания MDX файлов (Next.js)

`pages/api/mdx/[...slug].ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const fileName = Array.isArray(slug) ? slug.join('/') : slug;
  
  try {
    const filePath = path.join(process.cwd(), 'public', `${fileName}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(fileContent);
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
}
```

Этот `package.json` включает все необходимые зависимости для работы с MDX, подсветкой синтаксиса, и интерактивными React компонентами.