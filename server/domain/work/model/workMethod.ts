import type { CompletedWorkEntity, FailedWorkEntity, LoadingWorkEntity } from 'api/@types/work';
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
  create: async (val: {
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
      novelUrl: val.novelUrl,
      title: val.title,
      author: val.author,
      contentUrl: await s3.getSignedUrl(getContentKey(id)),
      createdTime: Date.now(),
      imageUrl: null,
      errorMsg: null,
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
