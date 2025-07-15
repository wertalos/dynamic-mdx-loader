import { useState } from 'react';
import DynamicMDXLoader from '../components/DynamicMDXLoader';
import DynamicMarkdocLoader from '../components/DynamicMarkdocLoader';
import DynamicHandlerbarsLoader from '../components/DynamicHandlebarsLoader';
import DynamicTemplateLoader from '../components/DynamicTemplateLoader';
import DynamicNunjucksLoader from '../components/DynamicNunjucksLoader';

interface LoaderConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  component: React.ComponentType;
  features: string[];
}

const loaders: LoaderConfig[] = [
  {
    id: 'mdx',
    name: 'MDX',
    description: 'Markdown + JSX - мощная комбинация для React-разработчиков',
    icon: '⚛️',
    color: '#61dafb',
    component: DynamicMDXLoader,
    features: ['React компоненты', 'JSX синтаксис', 'Интерактивность', 'Ecosystem']
  },
  {
    id: 'markdoc',
    name: 'MarkDoc',
    description: 'Структурированные документы с переменными и функциями',
    icon: '📝',
    color: '#4c51bf',
    component: DynamicMarkdocLoader,
    features: ['Переменные', 'Функции', 'Валидация', 'Безопасность']
  },
  {
    id: 'handlebars',
    name: 'Handlebars',
    description: 'Логические шаблоны с мощными циклами и условиями',
    icon: '🔧',
    color: '#f0772b',
    component: DynamicHandlerbarsLoader,
    features: ['Циклы', 'Условия', 'Хелперы', 'Логика']
  },
  {
    id: 'template',
    name: 'Template JS',
    description: 'Нативные JavaScript шаблонные строки',
    icon: '🟨',
    color: '#f7df1e',
    component: DynamicTemplateLoader,
    features: ['Нативный JS', 'Быстрый', 'Гибкий', 'Легкий']
  },
  {
    id: 'nunjucks',
    name: 'Nunjucks',
    description: 'Мощный шаблонизатор с фильтрами и макросами',
    icon: '🎨',
    color: '#1e4d72',
    component: DynamicNunjucksLoader,
    features: ['Фильтры', 'Макросы', 'Наследование', 'Async']
  }
];

export default function Home() {
  const [activeLoader, setActiveLoader] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLoaderChange = (index: number) => {
    if (index === activeLoader || isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveLoader(index);
      setIsTransitioning(false);
    }, 150);
  };

  const ActiveComponent = loaders[activeLoader].component;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <title>TemplateForge - Динамическая подгрузка контента</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"></link>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"></link>
      
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '20px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <h1 style={{
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: '700',
            margin: '0 0 10px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            🚀 TemplateForge
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.1rem',
            margin: 0,
            fontWeight: '300'
          }}>
            Сравните 5 технологий динамической загрузки контента
          </p>
        </div>
      </header>

      {/* Carousel Navigation */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '20px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {loaders.map((loader, index) => (
              <button
                key={loader.id}
                onClick={() => handleLoaderChange(index)}
                style={{
                  background: activeLoader === index 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${activeLoader === index ? loader.color : 'rgba(255, 255, 255, 0.2)'}`,
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transform: activeLoader === index ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow: activeLoader === index 
                    ? '0 4px 12px rgba(0,0,0,0.2)' 
                    : '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  if (activeLoader !== index) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeLoader !== index) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{loader.icon}</span>
                <span>{loader.name}</span>
                {activeLoader === index && (
                  <span style={{
                    background: loader.color,
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    marginLeft: '4px'
                  }}></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Info Panel */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '30px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{
              background: loaders[activeLoader].color,
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              {loaders[activeLoader].icon}
            </div>
            <div>
              <h3 style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '600',
                margin: '0 0 4px 0'
              }}>
                {loaders[activeLoader].name}
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                margin: 0,
                maxWidth: '400px'
              }}>
                {loaders[activeLoader].description}
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {loaders[activeLoader].features.map((feature, index) => (
              <span
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        background: 'white',
        minHeight: 'calc(100vh - 200px)',
        transition: 'opacity 0.3s ease',
        opacity: isTransitioning ? 0.7 : 1
      }}>
        <ActiveComponent />
      </div>

      {/* Footer */}
      <footer style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem',
            margin: 0
          }}>
            🚀 TemplateForge - Исследуйте различные подходы к динамической загрузке контента
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .loader-content {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
