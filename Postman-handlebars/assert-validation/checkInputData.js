const assert = require('assert');

function checkInputData(form) {
    try {
        assert.notEqual(form.methodId, '', 'Метод является обязательным полем');
        assert.notEqual(form.url, '', 'Url является обязательным полем');
        assert((form.keyParam1 !== '' && form.valueParam1 !== '') || (form.keyParam2 !== '' && form.valueParam2 !== ''), 'Для сохранения параметра запроса необходимо указать ключ и значение')
        assert((form.headerParam1 !== '' && form.headerValue1 !== '') || (form.headerParam2 !== '' && form.headerValue2 !== ''), 'Для сохранения заголовка запроса необходимо указать ключ и значение')
    } catch (error) {
        return error.message;
    }
}

export { checkInputData }