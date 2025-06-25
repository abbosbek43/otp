import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true
    }));

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('dars13')
    .build();

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap();