import { getIO } from '../config/socket.js';
import { SOCKET_EVENTS } from '../constants/index.js';

/**
 * Emits a new_response event and analytics_update to everyone in the poll room.
 */
export const emitNewResponse = (pollId, analytics) => {
  try {
    const io = getIO();
    console.log(`📡 Emitting updates for poll: ${pollId}`);
    
    const updateData = {
      ...analytics,
      pollId, // Explicitly include pollId
    };

    // Emit to both general poll room and dedicated analytics room
    io.to(`poll:${pollId}`).emit(SOCKET_EVENTS.NEW_RESPONSE, {
      pollId,
      totalResponses: analytics.totalResponses,
    });
    
    io.to(`poll:${pollId}`).emit(SOCKET_EVENTS.ANALYTICS_UPDATE, updateData);
    io.to(`analytics:${pollId}`).emit(SOCKET_EVENTS.ANALYTICS_UPDATE, updateData);
  } catch (err) {
    console.error('Socket emit error:', err.message);
  }
};

/**
 * Emits poll_expired event to everyone in the poll room.
 */
export const emitPollExpired = (pollId) => {
  try {
    const io = getIO();
    io.to(`poll:${pollId}`).emit(SOCKET_EVENTS.POLL_EXPIRED, { pollId });
  } catch (err) {
    console.error('Socket emit error:', err.message);
  }
};

/**
 * Emits poll_published event to everyone in the poll room.
 */
export const emitPollPublished = (pollId) => {
  try {
    const io = getIO();
    io.to(`poll:${pollId}`).emit(SOCKET_EVENTS.POLL_PUBLISHED, { pollId });
  } catch (err) {
    console.error('Socket emit error:', err.message);
  }
};
