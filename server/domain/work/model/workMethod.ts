import type { FavoriteEntity } from 'api/@types/favorite';
import type { HistoryEntity } from 'api/@types/history';
import type { UserEntity } from 'api/@types/user';
import type {
  CompletedWorkEntity,
  FailedWorkEntity,
  LoadingWorkEntity,
  WorkEntity,
} from 'api/@types/work';
import { getContentKeyHis, getImageKeyHis } from 'domain/history/service/getS3Key';
import { brandedId } from 'service/brandedId';
import { s3 } from 'service/s3Client';
import { ulid } from 'ulid';
import * as yup from 'yup';
import { getContentKey, getImageKey } from '../service/getS3Key';

const aozoraUrl = yup
  .string()
  .url('有効なURLでなければいけない')
  .test('is-http-or-https', 'URL must start with "aozora"', (value) => {
    if (typeof value !== 'string') return false;
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  })
  .test(
    'is-aozora-url',
    'URLは "https://www.aozora.gr.jp/" で始まる必要があります',
    (value) => typeof value === 'string' && value.startsWith('https://www.aozora.gr.jp/'),
  )
  .required();

const workSchema = yup.object().shape({
  novelUrl: aozoraUrl.required(),
  title: yup.string().max(255).required(),
  author: yup.string().max(255).required(),
});
export const workMethod = {
  createFav: async (val: { user: UserEntity; work: WorkEntity }): Promise<FavoriteEntity> => {
    try {
      await workSchema.validate(val);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new Error(`Validation failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred during validation.');
    }
    const id = brandedId.favorite.entity.parse(ulid());
    return {
      id,
      workId: val.work,
      authorId: { id: val.user.id, signInName: val.user.signInName },
      createdTime: Date.now(),
    };
  },
  crehis: async (val: {
    novelUrl: string;
    title: string;
    author: string;
  }): Promise<HistoryEntity> => {
    try {
      await workSchema.validate(val);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new Error(`Validation failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred during validation.');
    }
    const id = brandedId.history.entity.parse(ulid());
    return {
      id,
      status: 'completed',
      novelUrl: val.novelUrl,
      title: val.title,
      author: val.author,
      contentUrl: await s3.getSignedUrl(getContentKeyHis(id)),
      createdTime: Date.now(),
      imageUrl: '',
      errorMsg: null,
    };
  },
  create: async (val: {
    user: UserEntity;
    novelUrl: string;
    title: string;
    author: string;
  }): Promise<LoadingWorkEntity> => {
    try {
      await workSchema.validate(val);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new Error(`Validation failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred during validation.');
    }
    const id = brandedId.work.entity.parse(ulid());
    return {
      id,
      status: 'loading',
      user: { id: val.user.id, signInName: val.user.signInName },
      novelUrl: val.novelUrl,
      title: val.title,
      author: val.author,
      contentUrl: await s3.getSignedUrl(getContentKey(id)),
      createdTime: Date.now(),
      imageUrl: null,
      errorMsg: null,
    };
  },
  comphis: async (loadingWork: HistoryEntity): Promise<HistoryEntity> => {
    return {
      ...loadingWork,
      status: 'completed',
      imageUrl: await s3.getSignedUrl(getImageKeyHis(loadingWork.id)),
    };
  },
  complete: async (loadingWork: LoadingWorkEntity): Promise<CompletedWorkEntity> => {
    return {
      ...loadingWork,
      status: 'completed',
      imageUrl: await s3.getSignedUrl(getImageKey(loadingWork.id)),
    };
  },
  failure: (loadingWork: LoadingWorkEntity, errorMsg: string): FailedWorkEntity => {
    return {
      ...loadingWork,
      status: 'failed',
      errorMsg,
    };
  },
};
