import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:
      'https://task-tracer-frontend-my3q-l6kyknbn2-kents-projects-06757932.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger 設定
  const config = new DocumentBuilder()
    .setTitle('Daily Task Trace API')
    .setDescription('API documentation for Daily Task Trace Web')
    .setVersion('1.0')
    .addBearerAuth() // JWT Bearer
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8000);
  console.log(`Server running on http://localhost:8000`);
  console.log(`Swagger UI available at http://localhost:8000/api`);
}
bootstrap();
