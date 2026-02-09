import { Test, TestingModule } from '@nestjs/testing';
import { drizzle } from 'drizzle-orm/mysql2';
import type { MySqlRawQueryResult } from 'drizzle-orm/mysql2/session';

import * as schema from 'src/database/schema';
import { HealthCheckService } from '../health-check.service';

describe('HealthCheckService', () => {
  let service: HealthCheckService;
  let drizzleDb: jest.Mocked<ReturnType<typeof drizzle<typeof schema>>>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthCheckService,
        {
          provide: 'DATABASE_CONNECTION',
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HealthCheckService>(HealthCheckService);
    drizzleDb = module.get('DATABASE_CONNECTION');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkAppConnections', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return serving true when all dependencies are healthy', async () => {
      drizzleDb.execute.mockResolvedValue([
        { affectedRows: 0, fieldCount: 0, info: '', insertId: 0, serverStatus: 0, warningStatus: 0, changedRows: 0 },
        [],
      ] as unknown as MySqlRawQueryResult);

      const resultPromise = service.checkAppConnections();

      jest.advanceTimersByTime(3000);

      const result = await resultPromise;

      expect(result.serving).toBe(true);
      expect(result.message).toBe('All dependencies are healthy');
      expect(result.dependencies).toHaveLength(1);
      expect(result.dependencies).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: 'mysql', healthy: true })]),
      );
    });

    it('should return serving false when mysql is unhealthy', async () => {
      drizzleDb.execute.mockRejectedValue(new Error('connection refused'));

      const resultPromise = service.checkAppConnections();

      jest.advanceTimersByTime(3000);

      const result = await resultPromise;

      expect(result.serving).toBe(false);
      expect(result.message).toBe('One or more dependencies are unhealthy');
      expect(result.dependencies).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'mysql', healthy: false, message: 'connection refused' }),
        ]),
      );
    });

    it('should include latencyMs for each dependency', async () => {
      drizzleDb.execute.mockResolvedValue([
        { affectedRows: 0, fieldCount: 0, info: '', insertId: 0, serverStatus: 0, warningStatus: 0, changedRows: 0 },
        [],
      ] as unknown as MySqlRawQueryResult);

      const resultPromise = service.checkAppConnections();

      jest.advanceTimersByTime(3000);

      const result = await resultPromise;

      for (const dep of result.dependencies) {
        expect(typeof dep.latencyMs).toBe('number');
        expect(dep.latencyMs).toBeGreaterThanOrEqual(0);
      }
    });

    it('should handle non-Error rejection values', async () => {
      drizzleDb.execute.mockRejectedValue('string error');

      const resultPromise = service.checkAppConnections();

      jest.advanceTimersByTime(3000);

      const result = await resultPromise;

      expect(result.serving).toBe(false);
      expect(result.dependencies).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: 'mysql', healthy: false, message: 'string error' })]),
      );
    });

    it('should return unhealthy when a dependency times out', async () => {
      drizzleDb.execute.mockReturnValue(new Promise(() => {}) as never);

      const resultPromise = service.checkAppConnections();

      jest.advanceTimersByTime(3000);

      const result = await resultPromise;

      expect(result.serving).toBe(false);
      expect(result.dependencies).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'mysql',
            healthy: false,
            message: 'mysql health check timed out',
          }),
        ]),
      );
    });
  });
});
