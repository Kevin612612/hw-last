import { Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Req, UseGuards } from '@nestjs/common';
import { DeviceIdDTO } from '../dto/id.dto';
import { RefreshTokenService } from '../ENTITIES/tokens/refreshtoken.service';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';

// changeLikeStatus
// updateCommentById
// deleteComment
// findCommentById

@Controller('security')
export class DevicesController {
	constructor(@Inject(RefreshTokenService) protected refreshTokenService: RefreshTokenService) {}

	//(1)
	@UseGuards(RefreshTokenGuard)
	@Get('/devices')
	async getAllDevices(@Req() req) {
		const userId = req.user?.id || null;
		return await this.refreshTokenService.allDevices(userId);
	}

	//(2)
	@UseGuards(RefreshTokenGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/devices')
	async deleteOtherDevices(@Req() req) {
		//INPUT
		const userId = req.user?.id || null;
		const refreshToken = req.cookies.refreshToken;
		const payload = await this.refreshTokenService.getPayloadFromRefreshToken(refreshToken); //once guard is passed
		const deviceId = payload.deviceId;
		//BLL
		return await this.refreshTokenService.terminateAllOtherDevices(userId, deviceId);
	}

	//(3)
	@UseGuards(RefreshTokenGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/devices/:deviceId')
	async deleteOneDevice(@Param() params: DeviceIdDTO, @Req() req) {
		//INPUT
		const user = req.user ? req.user : null;
		const userId = user ? user.id : null;
		//BLL
		return await this.refreshTokenService.terminateCurrentDevice(userId, params.deviceId);
	}
}
