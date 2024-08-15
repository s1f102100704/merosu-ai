import { WS_PATH } from 'api/@constants';
import useWebSocket from 'react-use-websocket';
import { SERVER_PORT } from 'utils/envValues';

export const useWeb = () => {
  const socketUrl =
    process.env.NODE_ENV === 'production'
      ? `wss://${location.host}${WS_PATH}`
      : `ws://localhost:${SERVER_PORT}${WS_PATH}`;
  const { lastMessage } = useWebSocket(socketUrl);
  return { lastMessage };
};
