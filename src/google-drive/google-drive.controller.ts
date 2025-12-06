import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { google } from "googleapis";
import * as fs from "fs";

@Controller("google-drive")
export class GoogleDriveController {
  private oauth2Client;
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID2,
      process.env.GOOGLE_CLIENT_SECRET2,
      process.env.GOOGLE_CALLBACK_URL2
    );
  }
    @Get('auth')
  async auth() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID2,
      process.env.GOOGLE_CLIENT_SECRET2,
      process.env.GOOGLE_REDIRECT_URI2,
    );

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',    // IMPORTANTE para refresh token
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/drive.file'],
    });

    return { url };
  }


   @Get('oauth2/callback')
  async callback(@Query('code') code: string) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID2,
      process.env.GOOGLE_CLIENT_SECRET2,
      process.env.GOOGLE_REDIRECT_URI2,
    );

    const { tokens } = await oauth2Client.getToken(code);

    console.log('REFRESH TOKEN => ', tokens.refresh_token);

    return 'Guarda el refresh token en tu .env';
  }

}