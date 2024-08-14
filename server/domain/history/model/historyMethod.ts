import type { HistoryEntity } from 'api/@types/history';
import { getImageKey } from 'domain/history/service/getS3Key';
import { s3 } from 'service/s3Client';
export const historyMethod = {
  complete: async (loadingWork: HistoryEntity): Promise<HistoryEntity> => {
    return {
      ...loadingWork,
      status: 'completed',
      imageUrl: await s3.getSignedUrl(getImageKey(loadingWork.id)),
    };
  },
};
