import { Global, Module } from '@nestjs/common';
import { Universal } from './bll/universal.service';


@Global()
@Module({
  imports: [],
  providers: [Universal],
  exports: [Universal]
})
export class UniversalModule {
}
