import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SelDatabaseMiddleware } from './common/middleware/sel-database/sel-database.middleware';
import { ConfigModule } from '@nestjs/config';
import { PageController } from './page/page.controller';
import { PageService } from './page/page.service';
import { PageModule } from './page/page.module';
import { MenuController } from './menu/menu.controller';
import { MenuService } from './menu/menu.service';
import { MenuModule } from './menu/menu.module';
import { PhotoController } from './photo/photo.controller';
import { PhotoService } from './photo/photo.service';
import { PhotoModule } from './photo/photo.module';
import { AccessController } from './access/access.controller';
import { AccessService } from './access/access.service';
import { AccessModule } from './access/access.module';
import { ChipsController } from './chips/chips.controller';
import { ChipsService } from './chips/chips.service';
import { ChipsModule } from './chips/chips.module';
//import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ComponentController } from './component/component.controller';
import { ComponentService } from './component/component.service';
import { ComponentModule } from './component/component.module';
import { TitulPhotoController } from './titul-photo/titul-photo.controller';
import { TitulPhotoModule } from './titul-photo/titul-photo.module';
import { TitulPhotoService } from './titul-photo/titul-photo.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PreferController } from './prefer/prefer.controller';
import { PreferModule } from './prefer/prefer.module';
import { UserService } from './user/user.service';
import { PreferService } from './prefer/prefer.service';
import { EmployeeService } from './employee/employee.service';
import { EmployeeController } from './employee/employee.controller';
import { EmployeeModule } from './employee/employee.module';
import { SliderController } from './slider/slider.controller';
import { SliderService } from './slider/slider.service';
import { SliderModule } from './slider/slider.module';
import { VideoController } from './video/video.controller';
import { VideoService } from './video/video.service';
import { VideoModule } from './video/video.module';
import { EditorController } from './editor/editor.controller';
import { EditorService } from './editor/editor.service';
import { EditorModule } from './editor/editor.module';
import { FileController } from './file/file.controller';
import { FileService } from './file/file.service';

import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { TenantPoolModule } from './tenant-pool/ tenant-pool.module';
import { ImageService } from './services/image.service'


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env']
    }),
    MulterModule.register({
      dest: './uploads'
    }),
    FileModule,
    DatabaseModule,
    PageModule,
    MenuModule, 
    PhotoModule, 
    AccessModule, 
    ChipsModule, 
    AuthModule, 
    ComponentModule, 
    TitulPhotoModule, 
    UserModule, 
    PreferModule, 
    EmployeeModule, 
    SliderModule, 
    VideoModule, 
    EditorModule, 
    FileModule,
    TenantPoolModule 
  ],
  controllers: [AppController, PageController, MenuController, PhotoController, AccessController, ChipsController, ComponentController, TitulPhotoController, UserController, PreferController, EmployeeController, SliderController, VideoController, EditorController, FileController],
  providers: [AppService, PageService, MenuService, PhotoService, AccessService, ChipsService, ComponentService, TitulPhotoService, UserService, PreferService, EmployeeService, SliderService, VideoService, EditorService, FileService, ImageService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SelDatabaseMiddleware).forRoutes('*');
  }
}
