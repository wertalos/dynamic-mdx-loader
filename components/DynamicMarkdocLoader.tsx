import React, { useState, useCallback, createContext, useContext } from 'react';
import Markdoc from '@markdoc/markdoc';
import yaml from 'js-yaml';

// Types
interface Variables {
  user: { name: string; role: string };
  company: { name: string; projects: number; founded: number };
  currentDate: string;
  currentYear: number;
  loadTime: string;
  page?: any;
  buttonId?: string;
  [key: string]: any;
}

interface ButtonConfig {
  id: string;
  url: string;
  label: string;
}

// Context for dynamic variables
const VariablesContext = createContext<Variables | null>(null);

// Hook for accessing variables
const useVariables = () => {
  const context = useContext(VariablesContext);
  if (!context) throw new Error('useVariables must be used within VariablesProvider');
  return context;
};

// Reusable компоненты для Markdoc (теперь используют useVariables для динамического доступа)
const Button = ({ variant = 'primary', onclick, size = 'medium', children }) => {
  const handleClick = () => {
    if (onclick) {
      try {
        if (onclick.startsWith('alert(')) {
          const message = onclick.match(/alert\(['"`](.+?)['"`]\)/)?.[1];
          if (message) alert(message);
        } else if (onclick.startsWith('window.open(')) {
          const url = onclick.match(/window\.open\(['"`](.+?)['"`]/)?.[1];
          if (url) window.open(url, '_blank');
        }
      } catch (e) {
        console.error('Error executing onclick:', e);
      }
    }
  };

  const sizes = {
    small: { padding: '8px 16px', fontSize: '14px' },
    medium: { padding: '12px 24px', fontSize: '16px' },
    large: { padding: '16px 32px', fontSize: '18px' }
  };

  const variants = {
    primary: '#667eea',
    success: '#27ae60',
    warning: '#f39c12',
    danger: '#e74c3c'
  };

  return (
    <button
      onClick={handleClick}
      style={{
        background: variants[variant] || variants.primary,
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        margin: '8px 4px',
        transition: 'all 0.3s ease',
        ...sizes[size]
      }}
    >
      {children}
    </button>
  );
};

const Card = ({ title, color = '#f8f9fa', children }) => (
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
);

const Alert = ({ type = 'info', children }) => {
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
};

const Counter = ({ initial = 0, step = 1 }) => {
  const [count, setCount] = useState(initial);
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      background: '#f8f9fa',
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <button 
        onClick={() => setCount(count - step)}
        style={{
          background: '#dc3545',
          color: 'white',
          border: 'none',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          cursor: 'pointer'
        }}
      >
        -
      </button>
      <span style={{ fontSize: '16px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
        {count}
      </span>
      <button 
        onClick={() => setCount(count + step)}
        style={{
          background: '#28a745',
          color: 'white',
          border: 'none',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          cursor: 'pointer'
        }}
      >
        +
      </button>
    </div>
  );
};

const ServicesGrid = () => {
  const variables = useVariables();
  const services = variables.page?.services || [];
  return (
    <div>
      {services.map((service, index) => (
        <div key={index} style={{
          background: service.popular ? '#fff3cd' : '#f8f9fa',
          padding: '24px',
          background: '#f8f9fa',
          padding: '24px',
          borderRadius: '12px',
          margin: '16px 0',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ marginTop: 0 }}>{service.name}</h3>
          <p><strong>Стоимость:</strong> {service.price.toLocaleString('ru-RU')} руб.</p>
          <p><strong>Срок выполнения:</strong> {service.duration}</p>
          
          {service.popular && (
            <div style={{
              background: '#fff3cd',
              color: '#856404',
              padding: '12px',
              borderRadius: '6px',
              margin: '12px 0'
            }}>
              🔥 <strong>Популярная услуга!</strong> Выбор большинства наших клиентов
            </div>
          )}
          
          <button
            onClick={() => alert(`Заявка на ${service.name} принята!`)}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              margin: '8px 4px'
            }}
          >
            Заказать за {service.price.toLocaleString('ru-RU')} руб.
          </button>
        </div>
      ))}
    </div>
  );
};

const ProjectsGrid = ({ featured = false }) => {
  const variables = useVariables();
  const projects = variables.page?.projects || [];
  const filteredProjects = featured 
    ? projects.filter(project => project.featured)
    : projects;

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
      gap: '20px',
      margin: '20px 0'
    }}>
      {filteredProjects.map((project, index) => (
        <div key={index} style={{
          background: project.featured ? '#fff3cd' : '#f8f9fa',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ marginTop: 0 }}>{project.name} ({project.year})</h3>
          <p><strong>Технологии:</strong> {project.tech}</p>
          <p><strong>Результат:</strong> {project.result}</p>
          
          {project.featured && (
            <span style={{
              background: '#28a745',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              margin: '8px 0'
            }}>
              ⭐ Рекомендуемый
            </span>
          )}
          
          <div style={{ marginTop: '12px' }}>
            <button
              onClick={() => alert(`Проект ${project.name} - один из наших лучших!`)}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Подробнее о проекте
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const OfficesGrid = () => {
  const variables = useVariables();
  const offices = variables.page?.offices || [];
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
      gap: '20px' 
    }}>
      {offices.map((office, index) => (
        <div key={index} style={{
          background: office.main ? '#e3f2fd' : '#f8f9fa',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ marginTop: 0 }}>📍 Офис в {office.city}</h3>
          <p><strong>Адрес:</strong> {office.address}</p>
          <p><strong>Телефон:</strong> {office.phone}</p>
          <p><strong>Время работы:</strong> Пн-Пт 9:00-18:00</p>
          
          {office.main && (
            <div style={{
              background: '#d1ecf1',
              color: '#0c5460',
              padding: '12px',
              borderRadius: '6px',
              margin: '12px 0'
            }}>
              🏢 <strong>Главный офис</strong> - здесь находится основная команда
            </div>
          )}
          
          <button
            onClick={() => alert(`Маршрут до офиса в ${office.city} построен!`)}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Показать на карте
          </button>
        </div>
      ))}
    </div>
  );
};

const TestimonialsList = () => {
  const variables = useVariables();
  const testimonials = variables.page?.testimonials || [];
  return (
    <div>
      {testimonials.map((testimonial, index) => (
        <div key={index} style={{
          background: '#f8f9fa',
          padding: '24px',
          borderRadius: '12px',
          margin: '16px 0',
          borderLeft: '4px solid #667eea'
        }}>
          <h4 style={{ marginTop: 0 }}>{testimonial.author}, {testimonial.company}</h4>
          <blockquote style={{ 
            fontStyle: 'italic', 
            margin: '16px 0',
            fontSize: '18px',
            color: '#666'
          }}>
            "{testimonial.text}"
          </blockquote>
          <p><strong>Оценка:</strong> {'⭐'.repeat(testimonial.rating)}</p>
        </div>
      ))}
    </div>
  );
};

const TechStack = () => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
    gap: '15px', 
    margin: '20px 0' 
  }}>
    <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
      <strong>Frontend:</strong><br />
      React, Vue.js, Angular, Next.js
    </div>
    <div style={{ background: '#f3e5f5', padding: '15px', borderRadius: '8px' }}>
      <strong>Backend:</strong><br />
      Node.js, Python, Java, Go
    </div>
    <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px' }}>
      <strong>Mobile:</strong><br />
      React Native, Flutter
    </div>
    <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
      <strong>Cloud:</strong><br />
      AWS, Google Cloud, Azure
    </div>
  </div>
);

const SocialLinks = () => (
  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '20px 0' }}>
    <button 
      onClick={() => window.open('https://t.me/ourcompany', '_blank')}
      style={{ background: '#0088cc', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
    >
      📱 Telegram
    </button>
    <button 
      onClick={() => window.open('https://vk.com/ourcompany', '_blank')}
      style={{ background: '#4c75a3', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
    >
      🎵 VKontakte
    </button>
    <button 
      onClick={() => window.open('https://github.com/ourcompany', '_blank')}
      style={{ background: '#333', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
    >
      💻 GitHub
    </button>
    <button 
      onClick={() => window.open('https://linkedin.com/company/ourcompany', '_blank')}
      style={{ background: '#0077b5', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
    >
      💼 LinkedIn
    </button>
  </div>
);

const StatsGrid = () => {
  const variables = useVariables();
  const projects = variables.company.projects;
  const founded = variables.company.founded;
  const currentYear = variables.currentYear;
  
  return (
    <div style={{
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      margin: '16px 0'
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#667eea', margin: 0 }}>{projects.toLocaleString('ru-RU')}</h3>
          <p style={{ margin: '5px 0', color: '#666' }}>Всего проектов</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#27ae60', margin: 0 }}>{currentYear - founded}</h3>
          <p style={{ margin: '5px 0', color: '#666' }}>Лет опыта</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#f39c12', margin: 0 }}>⭐⭐⭐⭐⭐</h3>
          <p style={{ margin: '5px 0', color: '#666' }}>Средняя оценка</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#e74c3c', margin: 0 }}>95%</h3>
          <p style={{ margin: '5px 0', color: '#666' }}>Довольных клиентов</p>
        </div>
      </div>
    </div>
  );
};

const ContactForm = () => {
  const variables = useVariables();
  return (
    <div style={{
      background: '#ffffff',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #e9ecef',
      margin: '20px 0'
    }}>
      <h3>✉️ Напишите нам</h3>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Имя:</label>
            <input 
              type="text" 
              placeholder="Ваше имя"
              defaultValue={variables.user.name}
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Роль:</label>
            <input 
              type="text" 
              placeholder="Ваша роль"
              defaultValue={variables.user.role}
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }}
            />
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
          <input 
            type="email" 
            placeholder="your@email.com"
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Тема:</label>
          <select style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }}>
            <option>Веб-разработка</option>
            <option>Мобильные приложения</option>
            <option>Консультации</option>
            <option>Другое</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Сообщение:</label>
          <textarea 
            placeholder="Опишите ваш проект..."
            style={{ 
              width: '100%', 
              height: '120px', 
              padding: '12px', 
              border: '1px solid #ccc', 
              borderRadius: '6px',
              resize: 'vertical'
            }}
          />
        </div>
      </div>
      
      <button 
        onClick={() => alert(`Сообщение от ${variables.user.name} отправлено в ${variables.company.name}! Мы свяжемся с вами.`)}
        style={{
          background: '#27ae60',
          color: 'white',
          padding: '15px 30px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '15px'
        }}
      >
        Отправить сообщение
      </button>
    </div>
  );
};

const Conditional = ({ condition, children }) => {
  const variables = useVariables();
  let shouldRender = false;
  
  try {
    if (condition === 'projects_gt_30') {
      shouldRender = variables.company.projects > 30;
    } else if (condition === 'projects_gte_50') {
      shouldRender = variables.company.projects >= 50;
    } else if (condition === 'user_is_admin') {
      shouldRender = variables.user.role === 'admin';
    } else if (condition === 'user_is_manager') {
      shouldRender = variables.user.role === 'manager';
    }
  } catch (e) {
    console.error('Error evaluating condition:', e);
  }

  return shouldRender ? <div>{children}</div> : null;
};

// Объект с компонентами для Markdoc
const markdocComponents = {
  Button,
  Card,
  Alert,
  Counter,
  ServicesGrid,
  ProjectsGrid,
  OfficesGrid,
  TestimonialsList,
  TechStack,
  SocialLinks,
  StatsGrid,
  ContactForm,
  Conditional
};

// Reusable Navigation компонент
const Navigation = ({ buttons, loading, activeButton, onButtonClick }) => (
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
        id={button.id}
        onClick={() => onButtonClick(button.id, button.url)}
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
);

// Reusable VariablesPanel компонент
const VariablesPanel = ({ variables }) => (
  <div style={{ 
    background: '#f8f9fa', 
    padding: '15px', 
    borderBottom: '1px solid #dee2e6',
    fontSize: '14px',
    color: '#666'
  }}>
    <strong>Переменные:</strong> 
    Пользователь: {variables.user.name} ({variables.user.role}) | 
    Компания: {variables.company.name} | 
    Проекты: {variables.company.projects} | 
    Дата: {variables.currentDate}
  </div>
);

// Reusable ContentArea компонент
const ContentArea = ({ loading, error, content, onCloseError, variables }) => (
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
        <p>Загрузка MarkDoc контента...</p>
      </div>
    )}
    
    {error && (
      <div style={{ background: '#fee', color: '#c33', padding: '20px', borderRadius: '8px' }}>
        <h3>Ошибка загрузки</h3>
        <p>{error}</p>
        <button onClick={onCloseError}>Закрыть</button>
      </div>
    )}
    
    {!loading && !error && !content && (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <h2>Добро пожаловать в MarkDoc загрузчик!</h2>
        <p>Выберите страницу для загрузки интерактивного контента с поддержкой переменных и React компонентов.</p>
      </div>
    )}
    
    {!loading && !error && content && (
      <VariablesContext.Provider value={variables}>
        {Markdoc.renderers.react(content, React, { components: markdocComponents })}
      </VariablesContext.Provider>
    )}
  </div>
);

// Основной компонент
const DynamicMarkdocLoader = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [error, setError] = useState(null);
  const [variables, setVariables] = useState({
    user: { name: 'Алексей', role: 'admin' },
    company: { 
      name: 'IT Solutions', 
      projects: 50,
      founded: 2020
    },
    currentDate: new Date().toLocaleDateString('ru-RU'),
    currentYear: new Date().getFullYear(),
    services: [
	{
		name: "Веб-разработка",
		price: 50000,
		duration: "2-4 недели",
		popular: true
	},
	{
		name: "Мобильные приложения",
		price: 80000,
		duration: "4-8 недель",
		popular: false
	},
	{
		name: "Консалтинг",
		price: 15000,
		duration: "1-2 недели",
		popular: false
	}
	]
  });

  const buttons = [
    { id: '1', url: '/1.md', label: 'О компании' },
    { id: '2', url: '/2.md', label: 'Услуги' },
    { id: '3', url: '/3.md', label: 'Портфолио' },
    { id: '4', url: '/4.md', label: 'Контакты' }
  ];

  const functions = {
    equals: {
      transform(parameters) {
        const [a, b] = Object.values(parameters);
        return a === b;
      }
    },
    gt: {
      transform(parameters) {
        const [a, b] = Object.values(parameters);
        return a > b;
      }
    },
    add: {
      transform(parameters) {
        const [a, b] = Object.values(parameters);
        return Number(a) + Number(b);
      }
    },
    subtract: {
      transform(parameters) {
        const [a, b] = Object.values(parameters);
        return Number(a) - Number(b);
      }
    },
    multiply: {
      transform(parameters) {
        const [a, b] = Object.values(parameters);
        return Number(a) * Number(b);
      }
    },
    formatNumber: {
      transform(parameters) {
        const [num] = Object.values(parameters);
        return Number(num).toLocaleString('ru-RU');
      }
    }
  };

  const config = {
    tags: {
      button: {
        render: 'Button',
        attributes: {
          variant: { type: String, default: 'primary' },
          onclick: { type: String },
          size: { type: String, default: 'medium' }
        }
      },
      card: {
        render: 'Card',
        attributes: {
          title: { type: String },
          color: { type: String, default: '#f8f9fa' }
        }
      },
      alert: {
        render: 'Alert',
        attributes: {
          type: { type: String, default: 'info' }
        }
      },
      counter: {
        render: 'Counter',
        attributes: {
          initial: { type: Number, default: 0 },
          step: { type: Number, default: 1 }
        }
      },
      'services-grid': {
        render: 'ServicesGrid',
        attributes: {}
      },
      'projects-grid': {
        render: 'ProjectsGrid',
        attributes: {
          featured: { type: Boolean, default: false }
        }
      },
      'offices-grid': {
        render: 'OfficesGrid',
        attributes: {}
      },
      'testimonials-list': {
        render: 'TestimonialsList',
        attributes: {}
      },
      'tech-stack': {
        render: 'TechStack',
        attributes: {}
      },
      'social-links': {
        render: 'SocialLinks',
        attributes: {}
      },
      'stats-grid': {
        render: 'StatsGrid',
        attributes: {}
      },
      'contact-form': {
        render: 'ContactForm',
        attributes: {}
      },
      conditional: {
        render: 'Conditional',
        attributes: {
          condition: { type: String, required: true }
        }
      }
    },
    functions: functions
  };

  const loadMarkdocContent = useCallback(async (buttonId: string, url: string) => {
    setLoading(true);
    setActiveButton(buttonId);
    setError(null);
    setContent(null);
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Не удалось загрузить файл: ${response.status}`);
      }
      
      const markdocSource = await response.text();
      
      if (!markdocSource.trim()) {
        throw new Error('Пустой файл шаблона');
      }
      
      // Parse frontmatter
      let frontmatter = {};
      let markdocContent = markdocSource;
      
      if (markdocSource.startsWith('---')) {
        const endOfFrontmatter = markdocSource.indexOf('---', 3);
        if (endOfFrontmatter !== -1) {
          const frontmatterText = markdocSource.slice(3, endOfFrontmatter);
          markdocContent = markdocSource.slice(endOfFrontmatter + 3);
          
          try {
            frontmatter = yaml.load(frontmatterText) || {};
          } catch (e) {
            console.error('Error parsing frontmatter:', e);
            throw new Error('Ошибка парсинга frontmatter');
          }
        }
      }

      // Update variables with current page data
      const updatedVariables: Variables = {
        ...variables,
        page: frontmatter,
        buttonId: buttonId,
        loadTime: new Date().toLocaleTimeString('ru-RU')
      };
      
      setVariables(updatedVariables);

      // Parse and transform Markdoc content
      const ast = Markdoc.parse(markdocContent);
      const transformedContent = Markdoc.transform(ast, {
        ...config,
        variables: updatedVariables
      });
      
      setContent(transformedContent);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      console.error('Ошибка загрузки MarkDoc:', err);
      setError(`Ошибка загрузки страницы ${buttonId}: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [variables, config]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <Navigation 
        buttons={buttons} 
        loading={loading} 
        activeButton={activeButton} 
        onButtonClick={loadMarkdocContent} 
      />
      
      <VariablesPanel variables={variables} />
      
      <ContentArea 
        loading={loading} 
        error={error} 
        content={content} 
        onCloseError={() => setError(null)} 
        variables={variables} 
      />
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DynamicMarkdocLoader;