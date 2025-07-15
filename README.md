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
