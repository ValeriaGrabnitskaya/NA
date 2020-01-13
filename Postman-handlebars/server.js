require('ignore-styles'); // игнорировать CSS-файлы, если где-то будут импортироваться
require('@babel/register')({ 
  ignore: [/(node_modules)/], 
  presets: [
    ['@babel/preset-env',
      { 
        "targets": { 
          "node": "10.16",  // код будет запускаться под Node.js версии 10 и позже
          //"browsers": ["last 2 versions", "safari >= 7"]  // код будет запускаться на последних двух версиях всех браузеров, и на safari от 7 версии
        } 
      }    
    ]
  ] 
});

require('./script.js');