import type { CompletedWorkEntity, FailedWorkEntity, LoadingWorkEntity } from 'api/@types/work';
import { brandedId } from 'service/brandedId';
import { s3 } from 'service/s3Client';
import { ulid } from 'ulid';
import * as yup from 'yup';
import { getContentKey, getImageKey } from '../service/getS3Key';

const aozoraUrl = yup
  .string()
  .test(
    'is-aozora-url',
    'URL must start with "aozora"',
    (value) => typeof value === 'string' && value.startsWith('aozora'),
  );

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
