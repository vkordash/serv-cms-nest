import { Module } from '@nestjs/common';
import { createUploadPath, transliterate } from './utils.upload' // Импортируем наши функции

@Module({
  imports: [], // Другие модули
  controllers: [], // Если нужны контроллеры
  providers: [], // Если нужны сервисы, инжекторы
  exports: [createUploadPath, transliterate], // <<<--- ЭКСПОРТИРУЕМ ФУНКЦИИ, ЧТОБЫ ИХ МОГЛИ ИСПОЛЬЗОВАТЬ В ДРУГИХ МОДУЛЯх
})
export class UtilsUploadModule {}