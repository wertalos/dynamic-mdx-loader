Вы правы, в предыдущем ответе были проблемы с разметкой. Вот исправленная версия с правильной разметкой:

## 1. React компонент с MDX загрузчиком

```jsx
import React, { useState, useCallback } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

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
    setMdxSource(null);
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const mdxContent = await response.text();
      
      const serialized = await serialize(mdxContent, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight],
        },
      });
      
      setMdxSource(serialized);
      
    } catch (error) {
      console.error('Ошибка загрузки MDX:', error);
      setError(`Ошибка загрузки страницы ${buttonId}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const components = {
    Button: ({ children, variant = 'primary', onClick }) => (
      <button
        onClick={onClick}
        style={{
          background: variant === 'primary' ? '#667eea' : '#27ae60',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          margin: '8px 4px'
        }}
      >
        {children}
      </button>
    ),
    
    Card: ({ title, children }) => (
      <div style={{
        background: '#f8f9fa',
        padding: '24px',
        borderRadius: '12px',
        margin: '16px 0',
        border: '1px solid #e9ecef'
      }}>
        {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
        {children}
      </div>
    ),
    
    Alert: ({ type = 'info', children }) => {
      const colors = {
        info: '#d1ecf1',
        success: '#d4edda',
        warning: '#fff3cd',
        danger: '#f8d7da'
      };
      
      return (
        <div style={{
          background: colors[type],
          padding: '16px',
          borderRadius: '8px',
          margin: '16px 0'
        }}>
          {children}
        </div>
      );
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '20px',
        display: 'flex',
        gap: '12px'
      }}>
        {buttons.map(button => (
          <button
            key={button.id}
            id={button.id}
            onClick={() => loadMDXContent(button.id, button.url)}
            disabled={loading}
            style={{
              background: activeButton === button.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.2)',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {button.label}
          </button>
        ))}
      </nav>
      
      <div style={{ minHeight: '500px', padding: '40px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div>Загрузка MDX контента...</div>
          </div>
        )}
        
        {error && (
          <div style={{ background: '#fee', color: '#c33', padding: '20px', borderRadius: '8px' }}>
            <h3>Ошибка загрузки</h3>
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && !mdxSource && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <h2>Добро пожаловать в MDX загрузчик!</h2>
            <p>Выберите страницу для загрузки интерактивного контента.</p>
          </div>
        )}
        
        {mdxSource && !loading && !error && (
          <MDXRemote {...mdxSource} components={components} />
        )}
      </div>
    </div>
  );
};

export default DynamicMDXLoader;
```

## 2. Примеры MDX файлов (исправленные)

**public/1.mdx:**
```mdx
# О нашей компании

Добро пожаловать в **инновационную IT компанию**!

<Card title="Наша миссия">
Мы стремимся предоставлять качественные технологические решения, которые делают жизнь людей лучше и бизнес более эффективным.
</Card>

## Наши ценности

<Alert type="info">
**Инновации** - мы всегда ищем новые способы решения задач
</Alert>

<Alert type="success">
**Качество** - каждый наш продукт проходит строгий контроль качества
</Alert>

### Свяжитесь с нами

<Button onClick={() => alert('Спасибо за интерес к нашей компании!')}>
  Узнать больше
</Button>

---

> "Технологии должны служить людям, а не наоборот" - наш основной принцип

## Команда

Наша команда состоит из специалистов в области:

- Frontend разработки
- Backend разработки  
- UX/UI дизайна
- DevOps и инфраструктуры
- Тестирования качества
```

**public/2.mdx:**
```mdx
# Наши услуги

Мы предлагаем полный спектр IT-услуг для развития вашего бизнеса.

<Card title="Веб-разработка">
- Современные SPA приложения
- E-commerce платформы  
- Корпоративные сайты
- PWA приложения

<Button variant="primary">Заказать</Button>
</Card>

<Card title="Мобильные приложения">
- Native iOS/Android
- React Native
- Flutter приложения
- Гибридные решения

<Button variant="primary">Заказать</Button>
</Card>

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

<Button onClick={() => alert('Свяжитесь с нами для точного расчета!')}>
  Получить коммерческое предложение
</Button>

## Технологии

Мы используем современный стек технологий:

**Frontend:** React, Vue.js, Angular, Next.js
**Backend:** Node.js, Python, Java, Go
**Mobile:** React Native, Flutter, Swift, Kotlin
**Cloud:** AWS, Google Cloud, Azure, Docker

> Мы используем только проверенные и современные технологии для создания надежных решений.
```

**public/3.mdx:**
```mdx
# Портфолио проектов

Ознакомьтесь с нашими успешными реализациями и достижениями.

<Alert type="success">
За последний год мы завершили **50+ проектов** и получили высокие оценки от клиентов!
</Alert>

## Крупные проекты

<Card title="E-commerce платформа ShopFlow">

**Описание:** Полнофункциональный интернет-магазин с системой управления заказами

**Технологии:** React, Node.js, PostgreSQL, Redis

**Результат:** Увеличение продаж на 300%

<Button onClick={() => alert('Демо недоступно по соглашению о конфиденциальности')}>
  Посмотреть демо
</Button>

</Card>

<Card title="Мобильное приложение FoodDelivery">

**Описание:** Приложение для доставки еды с геолокацией и онлайн-оплатой

**Технологии:** React Native, Express.js, MongoDB

**Результат:** 100,000+ установок за первый месяц

<Button onClick={() => alert('Приложение доступно в App Store и Google Play')}>
  Скачать приложение
</Button>

</Card>

## Отзывы клиентов

> "Отличная команда профессионалов! Проект был выполнен в срок и превзошел все ожидания."
> 
> — **Иван Петров**, директор ООО "ТехноСтарт"

> "Благодаря новой CRM системе мы смогли увеличить эффективность работы на 40%. Рекомендуем!"
> 
> — **Мария Сидорова**, руководитель отдела продаж "МегаКорп"

<Button onClick={() => alert('Будем рады работать и с вами!')}>
  Стать нашим клиентом
</Button>
```

**public/4.mdx:**
```mdx
# Контакты

Свяжитесь с нами удобным для вас способом!

<Card title="Офис в Москве">
**Адрес:** г. Москва, ул. Тверская, д. 123, офис 456

**Телефон:** +7 (495) 123-45-67

**Email:** moscow@example.com

**Время работы:** Пн-Пт 9:00-18:00

<Button onClick={() => alert('Построить маршрут в Яндекс.Картах')}>
  Показать на карте
</Button>
</Card>

<Card title="Офис в СПб">
**Адрес:** г. Санкт-Петербург, Невский пр., д. 789

**Телефон:** +7 (812) 987-65-43

**Email:** spb@example.com

**Время работы:** Пн-Пт 10:00-19:00

<Button onClick={() => alert('Построить маршрут в Яндекс.Картах')}>
  Показать на карте
</Button>
</Card>

## Форма обратной связи

<Alert type="info">
Заполните форму ниже, и мы свяжемся с вами в течение 24 часов!
</Alert>

<Card title="Напишите нам">

<Button onClick={() => alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.')}>
  Отправить сообщение
</Button>

</Card>

## Социальные сети

Следите за нашими новостями и обновлениями:

<Button onClick={() => window.open('https://t.me/ourcompany', '_blank')}>
  Telegram
</Button>

<Button onClick={() => window.open('https://vk.com/ourcompany', '_blank')}>
  VKontakte
</Button>

<Button onClick={() => window.open('https://github.com/ourcompany', '_blank')}>
  GitHub
</Button>

## Быстрая связь

<Alert type="warning">
**Горячая линия:** +7 (800) 123-45-67 (бесплатно по России)
</Alert>

<Button onClick={() => alert('Функция в разработке')}>
  Экстренная связь
</Button>
```

## 3. package.json (исправленный)

```json
{
  "name": "dynamic-mdx-loader",
  "version": "1.0.0",
  "description": "Динамическая подгрузка MDX содержимого",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next-mdx-remote": "^4.4.1",
    "remark-gfm": "^3.0.1",
    "rehype-highlight": "^6.0.0",
    "highlight.js": "^11.9.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "typescript": "^5.0.0"
  }
}
```

## 4. pages/index.tsx (главная страница)

```tsx
import DynamicMDXLoader from '../components/DynamicMDXLoader';

export default function Home() {
  return (
    <div>
      <head>
        <title>Динамическая подгрузка MDX</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css" />
      </head>
      <DynamicMDXLoader />
    </div>
  );
}
```

## 5. Структура проекта

```
dynamic-mdx-loader/
├── package.json
├── pages/
│   └── index.tsx
├── components/
│   └── DynamicMDXLoader.jsx
└── public/
    ├── 1.mdx
    ├── 2.mdx
    ├── 3.mdx
    └── 4.mdx
```

Теперь разметка исправлена и не должна вызывать ошибки на GitHub Pages. Убраны все проблемные конструкции с вложенным кодом и неправильно экранированными символами.