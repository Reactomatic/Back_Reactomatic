import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Users handler')
  .setDescription('A simple API that allows anybody to get all or one user from a database.')
  .setVersion('1.0')
  .addTag('User')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);


  await app.listen(3000);
}
bootstrap();
