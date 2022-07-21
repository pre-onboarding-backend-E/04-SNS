import { ApiProperty } from '@nestjs/swagger';
import { CookieOptions, Response } from 'express';

export class BaseResponse {
  @ApiProperty({ description: '응답 코드' })
  statusCode: number;

  @ApiProperty({ description: '응답 메시지' })
  message: string;
}

export type ResponseHandlerOptions = Partial<Record<keyof Response, any>>;

export const defaultTokenCookieOption = (isAccessToken): CookieOptions => {
  const maxAge = Number(process.env[`JWT_${isAccessToken ? 'ACCESS' : 'REFRESH'}_TOKEN_EXPIRESIN`]);

  console.log(maxAge);
  return {
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    maxAge,
  };
};

export const responseHandler = (res: Response, options: ResponseHandlerOptions) => {
  const optionsArray = Object.entries(options);
  let jsonOrSend = [];
  res.cookie;

  optionsArray.forEach(([key, value]) => {
    if (key === 'json' || key === 'send') {
      jsonOrSend = [key, value];
    } else {
      executeResponseHandler(res, key, value);
    }
  });

  res.cookie;

  executeResponseHandler(res, jsonOrSend[0], jsonOrSend[1]);
};

export const executeResponseHandler = (res: Response, key, value) => {
  if (typeof res[key] === 'function') {
    Array.isArray(value)
      ? Array.isArray(value[0])
        ? value.forEach(v => res[key](...v))
        : res[key](...value)
      : res[key](value);
  } else {
    res[key] = value;
  }
};
