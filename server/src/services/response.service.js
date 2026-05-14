import Response from '../models/Response.js';
import Poll from '../models/Poll.js';
import Analytics from '../models/Analytics.js';
import ApiError from '../utils/ApiError.js';
import calculateAnalytics from '../utils/calculateAnalytics.js';

export const submitResponseService = async (pollId, answers, userId, ipAddress) => {
  const poll = await Poll.findById(pollId);
  if (!poll) throw new ApiError(404, 'Poll not found');

  // Enforce authentication for Quiz Mode
  if (poll.isQuiz && !userId) {
    throw new ApiError(401, 'You must be logged in to participate in this quiz.');
  }

  // Prevent multiple submissions
  if (userId) {
    const existingResponse = await Response.findOne({ pollId, respondent: userId });
    if (existingResponse) throw new ApiError(400, 'You have already responded to this poll.');
  } else if (ipAddress) {
    // Optional: Prevent IP-based duplicates for anonymous polls
    const existingResponse = await Response.findOne({ pollId, ipAddress });
    if (existingResponse) throw new ApiError(400, 'You have already responded to this poll from this device.');
  }

  // Validate mandatory questions
  const mandatoryQuestions = poll.questions
    .map((q, i) => ({ ...q.toObject(), index: i }))
    .filter((q) => q.required);

  for (const mq of mandatoryQuestions) {
    const answer = answers.find((a) => a.questionIndex === mq.index);
    if (!answer || !answer.selectedOption) {
      throw new ApiError(400, `Question "${mq.question}" is mandatory and requires an answer.`);
    }
  }

  // Map answers to include question text
  const enrichedAnswers = answers.map((a) => ({
    questionIndex: a.questionIndex,
    questionText: poll.questions[a.questionIndex]?.question || '',
    selectedOption: a.selectedOption || null,
  }));

  const response = await Response.create({
    pollId,
    respondent: userId || null,
    answers: enrichedAnswers,
    ipAddress,
  });

  // Increment total responses on poll
  await Poll.findByIdAndUpdate(pollId, { $inc: { totalResponses: 1 } });

  // Recalculate analytics
  const stats = await calculateAnalytics(pollId);
  await Analytics.findOneAndUpdate(
    { pollId },
    { totalResponses: stats.totalResponses, questionStats: stats.questionStats, updatedAt: new Date() },
    { upsert: true, new: true }
  );

  const result = { response, analytics: stats };
  if (poll.isQuiz) {
    result.quizResults = poll.questions.map((q) => q.correctOption);
  }

  return result;
};

export const getResponsesService = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);
  if (!poll) throw new ApiError(404, 'Poll not found');
  if (poll.createdBy.toString() !== userId.toString())
    throw new ApiError(403, 'Not authorised');

  return Response.find({ pollId }).populate('respondent', 'name email');
};
