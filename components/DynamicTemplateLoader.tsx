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