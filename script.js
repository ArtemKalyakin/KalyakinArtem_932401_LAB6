
console.log("Добро пожаловать на персональный сайт Артёма!");

var gameHours = [12, 2, 8, 15, 3, 1, 6];

console.log("Время по играм за неделю (часы):", gameHours);

// Поиск максимального значения
function findMax(arr) {
    var max = arr[0];

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    return max;
}

// Фильтрация игр
function filterGames(arr, threshold) {
    var result = [];

    for (var i = 0; i < arr.length; i++) {
        if (arr[i] > threshold) {
            result.push(arr[i]);
        }
    }

    return result;
}

// Суммирование массива
function sumArray(arr) {
    var sum = 0;

    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }

    return sum;
}

// Вычисление статистики
var maxHours = findMax(gameHours);
var popularGames = filterGames(gameHours, 10);
var popularHours = sumArray(popularGames);
var totalHours = sumArray(gameHours);

var lightCount = 0;

for (var i = 0; i < gameHours.length; i++) {
    if (gameHours[i] <= 3) {
        lightCount++;
    }
}

var lightShare = (lightCount / gameHours.length) * 100;

console.log("Максимум часов в одной игре:", maxHours);
console.log("Игры с временем > 10 часов:", popularGames);
console.log("Количество лёгких игр:", lightCount);
console.log("Доля коротких игровых сессий:", lightShare.toFixed(1) + "%");

if (totalHours > 25) {
    console.log("Возможно, стоит сбалансировать время между играми и учёбой");
}

// Основная работа с сайтом
document.addEventListener('DOMContentLoaded', function () {

    var toggleThemeBtn = document.getElementById('toggleThemeBtn');
    var toggleVisibilityBtn = document.getElementById('toggleVisibilityBtn');
    var addGameBtn = document.getElementById('addGameBtn');
    var removeLastGameBtn = document.getElementById('removeLastGameBtn');

    var gamesList = document.getElementById('games-list');
    var projectsList = document.getElementById('projects-list');

    var gamesSectionTitle = document.querySelector('#games h2');

    if (gamesSectionTitle) {
        gamesSectionTitle.setAttribute('title', 'Список любимых игр с рейтингом');
    }

    var projectsItems = document.querySelectorAll('#projects-list .card');

    projectsItems.forEach(function (item, index) {
        item.setAttribute('data-project-index', index);
    });

    var games = [];

    // Сохранение состояния сайта
    function saveState() {
        try {
            localStorage.setItem('games', JSON.stringify(games));

            localStorage.setItem(
                'theme',
                document.body.classList.contains('light-theme') ? 'light' : 'dark'
            );

            if (projectsList) {
                localStorage.setItem(
                    'projectsVisibility',
                    projectsList.classList.contains('hidden') ? 'hidden' : 'visible'
                );
            }

        } catch (e) {
            console.error('Ошибка сохранения:', e);
        }
    }

    // Загрузка состояния сайта
    function loadState() {
        try {
            var savedGames = localStorage.getItem('games');
            var savedTheme = localStorage.getItem('theme');
            var savedVisibility = localStorage.getItem('projectsVisibility');

            if (savedGames) {
                games = JSON.parse(savedGames);

                if (!Array.isArray(games)) {
                    games = [];
                }
            }

            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
            }

            if (savedVisibility === 'hidden' && projectsList) {
                projectsList.classList.add('hidden');
            }

        } catch (e) {
            console.error('Ошибка загрузки:', e);
            games = [];
        }
    }

    // Отображение списка игр
    function renderGames() {
        if (!gamesList) {
            console.error('Элемент #games-list не найден');
            return;
        }

        gamesList.innerHTML = '';

        games.forEach(function (game, index) {

            var card = document.createElement('div');
            card.className = 'game-card';

            card.setAttribute('data-game-index', index);
            card.dataset.title = game.title || '';
            card.dataset.genre = game.genre || '';

            var title = document.createElement('div');
            title.className = 'game-title';
            title.textContent = game.title || 'Без названия';

            title.setAttribute(
                'title',
                'Название игры: ' + (game.title || 'не указано')
            );

            var genre = document.createElement('div');
            genre.className = 'game-genre';
            genre.textContent = 'Жанр: ' + (game.genre || 'Не указан');

            genre.setAttribute(
                'title',
                'Жанр: ' + (game.genre || 'не указан')
            );

            var rating = document.createElement('div');
            rating.className = 'game-rating';

            var ratingNum = parseInt(game.rating, 10) || 1;

            rating.textContent =
                'Рейтинг: ' +
                '★'.repeat(ratingNum) +
                '☆'.repeat(5 - ratingNum);

            rating.setAttribute('data-rating', ratingNum);

            var deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-game-btn';
            deleteBtn.type = 'button';
            deleteBtn.textContent = 'Удалить';

            deleteBtn.setAttribute(
                'aria-label',
                'Удалить игру ' + (game.title || '')
            );

            deleteBtn.addEventListener('click', function () {
                games.splice(index, 1);
                renderGames();
                saveState();
            });

            card.appendChild(title);
            card.appendChild(genre);
            card.appendChild(rating);
            card.appendChild(deleteBtn);

            gamesList.appendChild(card);
        });
    }

    // Переключение темы
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', function () {
            document.body.classList.toggle('light-theme');
            saveState();
        });
    }

    // Скрытие и отображение проектов
    if (toggleVisibilityBtn && projectsList) {
        toggleVisibilityBtn.addEventListener('click', function () {
            projectsList.classList.toggle('hidden');
            saveState();
        });
    }

    // Добавление игры
    if (addGameBtn) {
        addGameBtn.addEventListener('click', function () {

            var title = prompt('Введите название игры:');

            if (title === null) {
                return;
            }

            title = title.trim();

            if (title === '') {
                alert('Название не может быть пустым!');
                return;
            }

            var genre = prompt('Введите жанр игры:');

            if (genre === null) {
                return;
            }

            genre = genre.trim();

            if (genre === '') {
                alert('Жанр не может быть пустым!');
                return;
            }

            var ratingStr = prompt('Введите рейтинг от 1 до 5:');

            if (ratingStr === null) {
                return;
            }

            var rating = parseInt(ratingStr, 10);

            if (isNaN(rating) || rating < 1 || rating > 5) {
                alert('Рейтинг должен быть числом от 1 до 5!');
                return;
            }

            games.push({
                title: title,
                genre: genre,
                rating: rating
            });

            renderGames();
            saveState();
        });
    }

    // Удаление последней игры
    if (removeLastGameBtn) {
        removeLastGameBtn.addEventListener('click', function () {

            if (games.length === 0) {
                alert('Список игр пуст!');
                return;
            }

            games.pop();

            renderGames();
            saveState();
        });
    }

    // Серверный калькулятор
    var calculatorForm = document.getElementById('calculatorForm');
    var calcResult = document.getElementById('calc-result');

    if (calculatorForm) {

        calculatorForm.addEventListener('submit', async function (event) {

            event.preventDefault();

            var a = document.getElementById('calc-a').value;
            var b = document.getElementById('calc-b').value;
            var operation = document.getElementById('calc-op').value;

            var operations = {
                '+': 'add',
                '-': 'sub',
                '*': 'mul',
                '/': 'div'
            };

            calcResult.textContent = 'Вычисляем...';

            try {
                var url = '/api/calc?a=' +
                    encodeURIComponent(a) +
                    '&b=' +
                    encodeURIComponent(b) +
                    '&op=' +
                    operations[operation];

                var response = await fetch(url);
                var data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Ошибка вычисления');
                }

                calcResult.textContent = 'Результат: ' + data.result;

            } catch (error) {
                calcResult.textContent = 'Ошибка: ' + error.message;
                console.error('Ошибка калькулятора:', error);
            }
        });
    }

    // Загружаем сохранённые данные
    loadState();

    // Отображаем игры
    renderGames();

});

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function (registration) {
                console.log('Service Worker зарегистрирован:', registration.scope);
            })
            .catch(function (error) {
                console.error('Ошибка регистрации Service Worker:', error);
            });
    });
}
