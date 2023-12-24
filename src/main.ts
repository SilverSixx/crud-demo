import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
//import { SeederService } from './user/users.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //const seeder = app.get(SeederService);
  const config = new DocumentBuilder()
    .setTitle('Crud demo')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);
  //await seeder.seedUsers();
  await app.listen(3000);
}
bootstrap();
