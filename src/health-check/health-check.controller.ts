import { Controller, Logger } from '@nestjs/common';

import { HealthCheckService } from './health-check.service';
import { HEALTH_CHECK_SERVICE_NAME, type HealthCheckResponse } from 'src/generated-types/health-check';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class HealthCheckController {
  private readonly logger = new Logger(HealthCheckController.name);
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @GrpcMethod(HEALTH_CHECK_SERVICE_NAME, 'CheckAppHealth')
  checkHealth(): HealthCheckResponse {
    this.logger.log('Health check requested');
    return {
      serving: true,
      message: 'User microservice is healthy',
    };
  }
}
