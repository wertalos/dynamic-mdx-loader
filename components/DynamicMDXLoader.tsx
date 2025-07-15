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
    
   Counter: ({ isThousand = false }) => {
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
	  {isThousand === true ? <span style={{ fontSize: '18px', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>Примерная стоимость проекта:</span> : <></>}
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
	  {isThousand === true ?  <span style={{ fontSize: '18px', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>× 1000$ = {count * 1000}$</span> : <></>}
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