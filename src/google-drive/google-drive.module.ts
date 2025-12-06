import { Module } from "@nestjs/common";
import { GoogleDriveController } from "./google-drive.controller";

@Module({
    controllers: [GoogleDriveController],
    providers: [],
})
export class GoogleDriveModule {}