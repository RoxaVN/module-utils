import { I18nErrorField, NotFoundException } from '@roxavn/core/base';
import { baseModule } from './module.js';

export class NotFoundSettingException extends NotFoundException {
  i18n = {
    default: {
      key: 'Error.NotFoundSettingException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };

  constructor(name: string, module: string) {
    super();
    this.i18n.default.params = { name, module };
  }
}

export class NotFoundTranslationException extends NotFoundException {
  i18n = {
    default: {
      key: 'Error.NotFoundTranslationException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };

  constructor(key: string, lang: string) {
    super();
    this.i18n.default.params = { key, lang };
  }
}
