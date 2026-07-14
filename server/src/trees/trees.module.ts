import { Module } from '@nestjs/common';
import { TreesService } from './trees.service';
import { TreesController } from './trees.controller';

@Module({
	providers: [TreesService],
	controllers: [TreesController],
	exports: [TreesService],
})
export class TreesModule {}
