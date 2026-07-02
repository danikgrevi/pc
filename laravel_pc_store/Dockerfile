# Используем официальный образ PHP с FPM
FROM php:8.2-fpm

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev

# Очищаем кэш пакетов
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Устанавливаем расширения PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Устанавливаем Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Создаем рабочую директорию
WORKDIR /var/www

# Копируем исходный код Laravel (пока пустой, мы его добавим позже)
COPY . .

# Меняем владельца файлов на пользователя www-data (пользователь Nginx/PHP-FPM)
RUN chown -R www-data:www-data /var/www

# Указываем, что контейнер слушает на порту 9000 (стандартный для PHP-FPM)
EXPOSE 9000

# Команда для запуска PHP-FPM
CMD ["php-fpm"]