import {
	Controller,
	Post,
	Get,
	Query,
	UseInterceptors,
	UploadedFile,
	Body,
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
	BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiTags,
	ApiOperation,
	ApiConsumes,
	ApiBody,
	ApiResponse,
	ApiQuery,
} from '@nestjs/swagger';
import { TreesService } from './trees.service';
import { SmartCacheInterceptor } from '../common/smart-cache.interceptor';
import { CacheTTL } from '@nestjs/cache-manager';
import 'multer';
import { TreeAnalysisDto } from './dto/tree-analysis.dto';

@ApiTags('Trees (Farm Intelligence)')
@Controller('v1/trees')
export class TreesController {
	constructor(private readonly treesService: TreesService) {}

	@Post('analyze')
	@ApiOperation({ summary: 'Analyze a tree image using AI' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				image: { type: 'string', format: 'binary' },
				county: { type: 'string' },
				landAcres: { type: 'string' },
				location: { type: 'string' },
				notes: { type: 'string' },
			},
		},
	})
	@ApiResponse({ status: 200, description: 'AI analysis result' })
	@UseInterceptors(FileInterceptor('image'))
	async analyzeTree(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }), // 10MB
					new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
				],
				exceptionFactory: (error) => new BadRequestException(error),
			}),
		)
		file: Express.Multer.File,
		@Body() body: TreeAnalysisDto,
	) {
		return this.treesService.analyzeTree(file, body);
	}

	@Get('history')
	@ApiOperation({ summary: 'Get history of tree analyses' })
	@ApiQuery({ name: 'limit', required: false, type: Number, description: 'Results per page (default 20, max 100)' })
	@ApiQuery({ name: 'cursor', required: false, type: String, description: 'Pagination cursor from previous response' })
	@ApiResponse({ status: 200, description: 'History data' })
	@UseInterceptors(SmartCacheInterceptor)
	async getHistory(
		@Query('limit') limit?: number,
		@Query('cursor') cursor?: string,
	) {
		return this.treesService.getHistory(limit, cursor);
	}

	@Get('quota')
	@UseInterceptors(SmartCacheInterceptor)
	@CacheTTL(600000) // 10 minutes
	@ApiOperation({ summary: 'Get current tree analysis quota' })
	async getQuota() {
		return this.treesService.getQuota();
	}
}
