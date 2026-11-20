
const CACHE_NAME = 'gamer-site-v2';

// Файлы, которые необходимо сохранить
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icons/icon-192.svg',
    '/icons/icon-512.svg'
];

// Установка Service Worker
self.addEventListener('install', function (event) {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Кеширование файлов приложения');

                return cache.addAll(FILES_TO_CACHE);
            })
    );

    self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', function (event) {

    event.waitUntil(
        caches.keys().then(function (cacheNames) {

            return Promise.all(
                cacheNames.map(function (cacheName) {

                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }

                })
            );

        })
    );

    self.clients.claim();
});

// Обработка запросов
self.addEventListener('fetch', function (event) {

    const request = event.request;
    const url = new URL(request.url);

    // Обрабатываем только GET-запросы своего сайта
    if (
        request.method !== 'GET' ||
        url.origin !== self.location.origin
    ) {
        return;
    }

    // API всегда обращается к серверу
    // В офлайн-режиме API недоступен
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    // Для страниц сначала используем сеть
    // Если интернета нет, открываем сохранённую страницу
    if (request.mode === 'navigate') {

        event.respondWith(
            fetch(request)
                .then(function (response) {

                    if (response.ok) {
                        const copy = response.clone();

                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(request, copy);
                        });
                    }

                    return response;
                })
                .catch(function () {

                    return caches.match(request).then(function (cached) {
                        return cached || caches.match('/');
                    });

                })
        );

        return;
    }

    // Для остальных статических файлов используем кеш
    event.respondWith(
        caches.match(request).then(function (cachedResponse) {

            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request).then(function (response) {

                if (response.ok) {
                    const copy = response.clone();

                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(request, copy);
                    });
                }

                return response;
            });

        })
    );

});
