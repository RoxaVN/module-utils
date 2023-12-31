import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import {
  NotFoundTranslationException,
  translationApi,
} from '../../base/index.js';
import { serverModule } from '../module.js';
import { Translation } from '../entities/translation.entity.js';
import { In } from 'typeorm';

@serverModule.useApi(translationApi.getOne)
export class GetTranslationApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof translationApi.getOne>) {
    const translation = await this.entityManager
      .getRepository(Translation)
      .findOne({
        cache: true,
        where: { id: request.translationId },
      });
    if (translation) {
      return translation;
    }
    throw new NotFoundException();
  }
}

@serverModule.useApi(translationApi.getMany)
export class GetTranslationsApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof translationApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [items, totalItems] = await this.entityManager
      .getRepository(Translation)
      .findAndCount({
        where: {
          key: request.key,
          lang: request.lang,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: items,
      pagination: { page, pageSize, totalItems },
    };
  }
}

@serverModule.useApi(translationApi.upsert)
export class UpsertTranslationApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof translationApi.upsert>) {
    const result = await this.entityManager
      .createQueryBuilder(Translation, 'translation')
      .insert()
      .values({
        key: request.key,
        lang: request.lang,
        content: request.content,
      })
      .orUpdate(['content'], ['key', 'lang'])
      .execute();

    return { id: result.generatedMaps[0].id };
  }
}

@serverModule.useApi(translationApi.update)
export class UpdateTranslationApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof translationApi.update>) {
    await this.entityManager
      .getRepository(Translation)
      .update(
        { id: request.translationId },
        { content: request.content, key: request.key, lang: request.lang }
      );
    return {};
  }
}

@serverModule.useApi(translationApi.delete)
export class DeleteTranslationApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof translationApi.delete>) {
    await this.entityManager
      .getRepository(Translation)
      .delete({ id: request.translationId });
    return {};
  }
}

@serverModule.injectable()
export class GetTranslationsbyKeysService extends InjectDatabaseService {
  async handle(request: { keys: string[]; lang?: string }) {
    const translations = await this.entityManager
      .getRepository(Translation)
      .find({
        select: ['content', 'key'],
        where: { key: In(request.keys), lang: request.lang },
      });
    const result: Record<string, string> = {};
    request.keys.map((key) => {
      const translation = translations.find((t) => t.key === key);
      if (translation) {
        result[key] = translation.content;
      } else {
        throw new NotFoundTranslationException(key, request.lang || '');
      }
    });
    return result;
  }
}
