import React, { useState, useCallback, useEffect } from 'react';

const DynamicNunjucksLoader = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [error, setError] = useState(null);
  const [nunjucks, setNunjucks] = useState(null);

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

  // Загружаем Nunjucks динамически
  useEffect(() => {
    const loadNunjucks = async () => {
      try {
        // Загружаем Nunjucks из CDN
        if (typeof window !== 'undefined' && !window.nunjucks) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/nunjucks/3.2.4/nunjucks.min.js';
          script.onload = () => {
            if (window.nunjucks) {
              const env = window.nunjucks.configure({ autoescape: false });
              
              // Добавляем кастомные фильтры
              env.addFilter('currency', function(num) {
                return Number(num).toLocaleString('ru-RU') + ' руб.';
              });

              env.addFilter('date', function(date) {
                if (date instanceof Date) {
                  return date.toLocaleDateString('ru-RU');
                }
                return new Date(date).toLocaleDateString('ru-RU');
              });

              env.addFilter('repeat', function(count, char) {
                return char.repeat(count || 0);
              });

              env.addFilter('formatNumber', function(num) {
                return Number(num).toLocaleString('ru-RU');
              });

              setNunjucks(env);
            }
          };
          script.onerror = () => {
            setError('Не удалось загрузить библиотеку Nunjucks');
          };
          document.head.appendChild(script);
        } else if (window.nunjucks) {
          // Если Nunjucks уже загружен
          const env = window.nunjucks.configure({ autoescape: false });
          
          env.addFilter('currency', function(num) {
            return Number(num).toLocaleString('ru-RU') + ' руб.';
          });

          env.addFilter('date', function(date) {
            if (date instanceof Date) {
              return date.toLocaleDateString('ru-RU');
            }
            return new Date(date).toLocaleDateString('ru-RU');
          });

          env.addFilter('repeat', function(count, char) {
            return char.repeat(count || 0);
          });

          env.addFilter('formatNumber', function(num) {
            return Number(num).toLocaleString('ru-RU');
          });

          setNunjucks(env);
        }
      } catch (error) {
        console.error('Ошибка загрузки Nunjucks:', error);
        setError('Ошибка инициализации Nunjucks');
      }
    };

    loadNunjucks();
  }, []);

  const loadNunjucksContent = useCallback(async (buttonId, url) => {
    if (!nunjucks) {
      setError('Nunjucks еще не загружен. Попробуйте еще раз.');
      return;
    }

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
      
      // Рендерим шаблон с помощью настоящего Nunjucks
      const rendered = nunjucks.renderString(templateSource, {
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
  }, [nunjucks, templateData]);

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
            disabled={loading || !nunjucks}
            style={{
              background: activeButton === button.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.2)',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: (loading || !nunjucks) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: !nunjucks ? 0.6 : 1
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
        {!nunjucks && <span style={{ color: '#dc3545', marginLeft: '10px' }}>⏳ Загрузка Nunjucks...</span>}
        {nunjucks && <span style={{ color: '#28a745', marginLeft: '10px' }}>✅ Nunjucks готов</span>}
      </div>
      
      <div style={{ minHeight: '500px', padding: '40px' }}>
        {!nunjucks && !error && (
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
            Загрузка библиотеки Nunjucks...
          </div>
        )}

        {loading && nunjucks && (
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
        
        {!loading && !error && !content && nunjucks && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <h2>Добро пожаловать в Nunjucks загрузчик!</h2>
            <p>Выберите страницу для загрузки мощных шаблонов с настоящей библиотекой Nunjucks.</p>
            <div style={{ background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
              ✅ <strong>Библиотека Nunjucks загружена и готова к работе!</strong>
            </div>
          </div>
        )}
        
        {content && !loading && !error && (
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