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
- после установки появляется возможность писать в ES6+ с транспиляцией в кросс-браузерный ES5
- включить SASS
- автоматически добавляются сниппеты, подключающие webpack bundles `footer.php` и `header.php` шаблоны `/bitrix/templates` и `/local/templates`

После установки Webpack будет настроен на транспиляцию в ES5, объединение и минификацию вендорных и кастомных для проекта js-скриптов. Объединение и расстановку префиксов для css-стилей. Для обхода агрессивного браузерного кеширования к созданным webpack'ом bundles добавляется хэш в название bundle, например в итоге получится:

```html
  <link rel="stylesheet" href="/local/dist/vendor.2b7f85651db9f3360f22.css">
  <link rel="stylesheet" href="/local/dist/custom.f9ef87764ca646e868fa.css">
</head>
```

Для скриптов:

```html
    <script src="/local/dist/vendor.2b7f85651db9f3360f22.js"></script>
    <script src="/local/dist/custom.f9ef87764ca646e868fa.js"></script>
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

<h2 id="config">Конфигурация</h2>

Будет добавлено создана структуру проекта следующие директории:

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
/local/
  /src/
    webpack_custom.js
    webpack_vendor.js
.babelrc
.browserlistrc
package.json

```

Где `/build` содержатся настройки Webpack.

Из `/custom` содержатся кастомные стили и скрипты проекта. Пример с Vue. 

В `/local/src` импортируются js и css, которые должны подключаться через вебпак и быть доступны на всем сайте. 

Посмотрите и исправьте если нужно файл `.browserlistrc`, чтобы добавить или убрать поддержку браузеров. По умолчанию включена поддержка браузеров, начиная с IE11.

<h2 id="build">Как пользоваться</h2>

Для запуска сборки в режиме разработки выполните команду 
```bash
$ npm run dev
```
> Сборщик сгенерирует все файлы, указанные `/local/src/webpack_custom.js` и `/local/src/webpack_vendor.js` и начнет наблюдать за изменениями в реальном времени. 

Для запуска сборки в режиме продакшена  
```bash
$ npm run prod
```
> Сборщик сгенерирует все файлы, указанные `/local/src/webpack_custom.js` и `/local/src/webpack_vendor.js` и применит оптимизацию кода. 
