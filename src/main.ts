import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT ?? 3000;
  console.log(`starting `+port);

  const config = new DocumentBuilder()
        .setTitle('Notes API')
        .setDescription('The notes API description')
        .setVersion('1.0')        
        .addTag('Site')
        .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
        origin: (origin, callback) => {
          const allowedOrigins = [
              '*',
              'https://site.menarada.gov.ua',
              'https://menarada.gov.ua',
              'http://localhost:4200',
              'http://localhost:4201',
          ];

          console.log('cors '+origin);
          // Если нет origin (например Postman) — разрешаем
            if (!origin) {
              return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
              return callback(null, true);
            }

            return callback(new Error('Not allowed by CORS'), false);
        },            
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept, Authorization',
        credentials: true,
      });
  
  // Или если файлы в папке 'public'
  /*app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/web_docs', // URL путь к файлам
  }); */   

  await app.listen(port);
}
bootstrap();
