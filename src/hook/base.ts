import {
  BaseService,
  CreateRoleService,
  SetAdminRoleService,
  inject,
} from '@roxavn/core/server';

import { UpsertSettingService, serverModule } from '../server/index.js';

@serverModule.injectable()
export abstract class UtilsInstallHook extends BaseService {
  constructor(
    @inject(CreateRoleService)
    protected createRoleService: CreateRoleService,
    @inject(SetAdminRoleService)
    protected setAdminRoleService: SetAdminRoleService,
    @inject(UpsertSettingService)
    protected upsertSettingService: UpsertSettingService
  ) {
    super();
  }
}
