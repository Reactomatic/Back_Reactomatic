import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


    // Activer CORS pour votre domaine spécifique
    app.enableCors({
      origin: 'http://51.89.139.78.nip.io',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization',
      credentials: true, // Si vous devez autoriser les cookies ou autres informations d'identification
    });
  

  const config = new DocumentBuilder()
    .setTitle('Reactomatic API')
    .setDescription('The Reactomatic API description')
    .setVersion('1.0')
    .addTag('reactomatic')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
