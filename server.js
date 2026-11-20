
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Главная страница сайта
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Информация о сайте
app.get('/about', (req, res) => {
    res.send('Персональный сайт Калякина Артёма');
});

// Серверный калькулятор
app.get('/api/calc', (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);
    const op = req.query.op;

    // Проверка введённых чисел
    if (
        req.query.a === undefined ||
        req.query.b === undefined ||
        !Number.isFinite(a) ||
        !Number.isFinite(b)
    ) {
        return res.status(400).json({
            error: 'Введите корректные числа'
        });
    }

    let result;

    // Выполнение математической операции
    switch (op) {
        case 'add':
            result = a + b;
            break;

        case 'sub':
            result = a - b;
            break;

        case 'mul':
            result = a * b;
            break;

        case 'div':
            if (b === 0) {
                return res.status(400).json({
                    error: 'На ноль делить нельзя'
                });
            }
            result = a / b;
            break;

        default:
            return res.status(400).json({
                error: 'Неизвестная операция'
            });
    }

    // Отправка результата в формате JSON
    res.json({
        result: result
    });
});



app.get('/api/status', (req, res) => {
  res.json({
      status: 'OK',
      message: 'Сервер работает',
      student: 'Калякин Артём'
  });
});

// Подключение статических файлов сайта
app.use(express.static(__dirname));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
