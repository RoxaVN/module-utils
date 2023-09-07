export type SettingType = 'public' | 'private';

export interface UpsertSettingRequest {
  module: string;
  name: string;
  type: SettingType;
  metadata: Record<string, any>;
}

export interface SettingResponse {
  module: string;
  name: string;
  metadata: any;
  updatedDate: Date;
  type: SettingType;
}
