import React, { useState, useCallback } from 'react';
import Handlebars from 'handlebars';

const DynamicHandlebarsLoader = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [error, setError] = useState(null);

  // Данные для шаблонов
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
    { id: '1', url: '/1.hbs', label: 'О компании' },
    { id: '2', url: '/2.hbs', label: 'Услуги' },
    { id: '3', url: '/3.hbs', label: 'Портфолио' },
    { id: '4', url: '/4.hbs', label: 'Контакты' }
  ];

  // Регистрируем все необходимые хелперы
  React.useEffect(() => {
    // Математические операции
    Handlebars.registerHelper('add', function(a, b) {
      return Number(a) + Number(b);
    });

    Handlebars.registerHelper('subtract', function(a, b) {
      return Number(a) - Number(b);
    });

    Handlebars.registerHelper('multiply', function(a, b) {
      return Number(a) * Number(b);
    });

    Handlebars.registerHelper('divide', function(a, b) {
      return Number(a) / Number(b);
    });

    // Сравнения
    Handlebars.registerHelper('eq', function(a, b) {
      return a === b;
    });

    Handlebars.registerHelper('gt', function(a, b) {
      return a > b;
    });

    Handlebars.registerHelper('lt', function(a, b) {
      return a < b;
    });

    Handlebars.registerHelper('gte', function(a, b) {
      return a >= b;
    });

    // Форматирование
    Handlebars.registerHelper('formatNumber', function(num) {
      return Number(num).toLocaleString('ru-RU');
    });

    Handlebars.registerHelper('currency', function(num) {
      return Number(num).toLocaleString('ru-RU') + ' руб.';
    });

    // Повторение символов
    Handlebars.registerHelper('repeat', function(count, char) {
      return char.repeat(count);
    });

    // Условия
    Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    });

    // Логирование для отладки
    Handlebars.registerHelper('log', function(context) {
      console.log(context);
      return '';
    });

  }, []);

  const loadHandlebarsContent = useCallback(async (buttonId, url) => {
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
      
      // Компилируем шаблон
      const template = Handlebars.compile(templateSource);
      
      // Рендерим с данными
      const renderedContent = template({
        ...templateData,
        buttonId: buttonId,
        loadTime: new Date().toLocaleTimeString('ru-RU')
      });
      
      setContent(renderedContent);
      
    } catch (error) {
      console.error('Ошибка загрузки Handlebars:', error);
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
            onClick={() => loadHandlebarsContent(button.id, button.url)}
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
            Загрузка Handlebars контента...
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
            <h2>Добро пожаловать в Handlebars загрузчик!</h2>
            <p>Выберите страницу для загрузки контента с переменными и циклами.</p>
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

export default DynamicHandlebarsLoader;