import { InferApiRequest } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import {
  NotFoundSettingException,
  UpsertSettingRequest,
} from '../../base/index.js';
import { Setting } from '../entities/index.js';
import { serverModule } from '../module.js';
import { settingApi } from '../../base/apis/index.js';

@serverModule.useApi(settingApi.getPublic)
export class GetPublicSettingService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof settingApi.getPublic>) {
    const result = await this.entityManager.getRepository(Setting).findOne({
      select: ['metadata'],
      where: { module: request.module, name: request.name, type: 'public' },
    });
    if (result) {
      return result.metadata;
    }
    throw new NotFoundSettingException(request.name, request.module);
  }
}

@serverModule.useApi(settingApi.getAll)
export class GetModuleSettingsService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof settingApi.getAll>) {
    const items = await this.entityManager.getRepository(Setting).find({
      where: { module: request.module },
    });
    return { items };
  }
}

@serverModule.injectable()
export class GetSettingService extends InjectDatabaseService {
  async handle(request: { module: string; name: string }) {
    const result = await this.entityManager.getRepository(Setting).findOne({
      where: {
        name: request.name,
        module: request.module,
      },
    });
    if (result) {
      return result.metadata;
    }
    throw new NotFoundSettingException(request.name, request.module);
  }
}

@serverModule.injectable()
export class UpsertSettingService extends InjectDatabaseService {
  async handle(request: UpsertSettingRequest) {
    await this.entityManager
      .createQueryBuilder(Setting, 'setting')
      .insert()
      .values({
        module: request.module,
        name: request.name,
        metadata: request.metadata,
        type: request.type,
      })
      .orUpdate(['metadata', 'type'], ['module', 'name'])
      .execute();
    return {};
  }
}
