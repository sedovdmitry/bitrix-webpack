# bitrix-webpack
bitrix-webpack — консольный инструмент для автоматического разворачивания Webpack в битрикс-приложении.
Основная цель — упростить и автоматизировать первоначальную настройку Webpack для битрикс-проекта.

## Содержание
1. [Описание](#introduction)
2. [Установка](#install)
3. [Конфигурация](#config)
4. [Как пользоваться](#build)

<h2 id="introduction">Описание</h2>

bitrix-webpack — одной командой разворачивает и настраивает сборщик проектов Webpack4 с установкой следующих CSS- и JS- фреймворков:

- Webpack 4
- js-фреймворк Vue 2 с примером
- css-фреймворк Uikit 3
- включить поддержку SASS
- разделение css и js на вендорные и кастомные стили и скрипты
- автоматически добавляются сниппеты, подключающие собранные webpack'ом файлы в `footer.php` и в `header.php` во все шаблоны, расположенные в `/bitrix/templates` и `/local/templates`.

После установки Webpack будет настроен на транспиляцию в ES5, объединение и минификацию вендорных и кастомных для проекта js-скриптов. Объединение, минификацию и расстановку префиксов для css-стилей. Для обхода агрессивного браузерного кеширования к созданным webpack'ом файлам добавляется хэш в название.

В итоге получится:

```html
  <link rel="stylesheet" href="/dist/vendor.2b7f85651db9f3360f22.css">
  <link rel="stylesheet" href="/dist/custom.f9ef87764ca646e868fa.css">
</head>
```

```html
    <script src="/dist/vendor.2b7f85651db9f3360f22.js"></script>
    <script src="/dist/custom.f9ef87764ca646e868fa.js"></script>
</body>
```

<h2 id="install">Установка</h2>

1. Перейдите в консоли в самую верхнюю директорию проекта.
2. **Важно.** Убедитесь, что нет файла `package.json`, так как скрипт его не перезаписывает, а только создает.
3. Установить

```bash
$ npm install -g bitrix-webpack
```

Запустить с установкой всех зависимостей
```bash
$ bitrix-webpack --install
```

Запустить без установки всех зависимостей.
```bash
$ bitrix-webpack
```

Появится меню, где можно будет выбрать устанавливать поддержку SASS или нет:

![](https://github.com/sedovdmitry/bitrix-webpack/blob/master/assets/console.png?raw=true)


В случае без запуска флага `--install` можно до установки зависимостей отредактировать `package.json`, удалить ненужные зависимости, добавить свои, и только потом установить зависимости:

```bash
$ npm i
```

Если для каких-то шаблонов не нужно подключать стили и скрипты (например, для лендингов), генерируемые для основного сайта, то нужно будет зайти и удалить из этих шаблонов сниппеты, автоматически добавленными перед закрывающимися тегами `<head/>` и `<body/>`.

<h2 id="config">Конфигурация</h2>

В структуру битрикс-проекта будут добавлены следующие директории и файлы:

```
/build/
  config.base.js
  config.development.js
  config.production.js
  getWebpackAssets.php
/custom/
  /css/
    example.css
  /img/
    webpack.png
  /js/
    hello_webpack.js
  /vue/
    /assets/
      logo.png
    /components/
      Hello.vue
    Example.vue
    main.js
/src/
  webpack_custom.js
  webpack_vendor.js
.babelrc
.browserlistrc
package.json

```

Где в `/build` содержатся настройки Webpack.

В `/custom` содержатся кастомные стили и скрипты проекта. Есть пример с Vue.

В `/src` импортируются js и css, которые забирать Webpack. В файле `/src/webpack_vendor.js` импортируйте js- и css- библиотеки, фреймворки, т.е. которые редко меняются:

```js
// vendor styles
import '../../node_modules/uikit/dist/css/uikit.css'

// vendor js
// set uikit in global variable
import UIkit from 'uikit'
window.UIkit = UIkit;
```

В файл `/src/webpack_custom.js` импортируйте специфические для проекта стили и скрипты.

Такое разделение на вендорные и кастомные файлы позволяет лишний раз не пересобирать Webpack'у редко изменяющиеся вендорные зависимости.

```js
// styles
import '../../custom/css/example.css';

// js
import '../../custom/js/hello_webpack';

// vue
import '../../custom/vue/main';
```

Посмотрите и исправьте если нужно файл `.browserlistrc`, чтобы добавить или убрать поддержку браузеров. По умолчанию включена поддержка браузеров, начиная с IE11.

<h2 id="build">Как пользоваться</h2>

Для запуска сборки в режиме разработки выполните команду
```bash
$ npm run dev
```
> Сборщик сгенерирует все файлы, указанные `/src/webpack_custom.js` и `/src/webpack_vendor.js` и начнет наблюдать за изменениями в реальном времени.

Для запуска сборки в режиме продакшена  
```bash
$ npm run prod
```
> Сборщик сгенерирует все файлы, указанные `/src/webpack_custom.js` и `/src/webpack_vendor.js` и применит все оптимизации.
