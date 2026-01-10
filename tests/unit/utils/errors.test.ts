import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  handleApiError,
} from '@/lib/utils/errors';
import { z } from 'zod';
import { NextResponse } from 'next/server';

describe('Error Handling', () => {
  describe('AppError', () => {
    it('should create error with default status code', () => {
      const error = new AppError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });

    it('should create error with custom status code', () => {
      const error = new AppError('Not found', 404);
      expect(error.statusCode).toBe(404);
    });
  });

  describe('Custom Errors', () => {
    it('should create ValidationError', () => {
      const error = new ValidationError('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should create AuthenticationError', () => {
      const error = new AuthenticationError();
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('AUTHENTICATION_ERROR');
    });

    it('should create AuthorizationError', () => {
      const error = new AuthorizationError();
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('AUTHORIZATION_ERROR');
    });

    it('should create NotFoundError', () => {
      const error = new NotFoundError('User');
      expect(error.message).toBe('User not found');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('handleApiError', () => {
    it('should handle ZodError', () => {
      const schema = z.object({ email: z.string().email() });
      const result = schema.safeParse({ email: 'invalid' });
      
      if (!result.success) {
        const response = handleApiError(result.error);
        expect(response.status).toBe(400);
      }
    });

    it('should handle AppError', () => {
      const error = new NotFoundError('Resource');
      const response = handleApiError(error);
      
      expect(response.status).toBe(404);
    });

    it('should handle generic Error', () => {
      const error = new Error('Generic error');
      const response = handleApiError(error);
      
      expect(response.status).toBe(500);
    });
  });
});
