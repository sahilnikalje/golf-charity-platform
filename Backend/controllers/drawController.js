const Draw = require('../models/drawModel');
const Winner = require('../models/winnerModel');
const Score = require('../models/scoreModel');
const User = require('../models/userModel');
const { generateRandomDraw, generateAlgorithmicDraw, checkMatch } = require('../utils/drawEngine');
const { calculatePrizePool, splitPrize } = require('../utils/prizeCalculator');

// @GET /api/draws
const getDraws = async (req, res) => {
  try {
    const draws = await Draw.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(draws);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/draws/latest
const getLatestDraw = async (req, res) => {
  try {
    const draw = await Draw.findOne({ status: 'published' }).sort({ createdAt: -1 });
    res.json(draw || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/draws/simulate (admin)
const simulateDraw = async (req, res) => {
  try {
    const { drawType, month, year } = req.body;
    let winningNumbers;

    if (drawType === 'algorithmic') {
      const allScoreDocs = await Score.find();
      const allScores = allScoreDocs.flatMap(doc => doc.scores.map(s => s.value));
      winningNumbers = generateAlgorithmicDraw(allScores);
    } else {
      winningNumbers = generateRandomDraw();
    }

    const draw = await Draw.create({
      month, year, winningNumbers, drawType, status: 'simulated',
    });
    res.json({ draw, winningNumbers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/draws/:id/publish (admin)
const publishDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });

    const subscribers = await User.find({ isSubscribed: true });
    const fiveMatches = [], fourMatches = [], threeMatches = [];

    for (const user of subscribers) {
      const scoreDoc = await Score.findOne({ user: user._id });
      if (!scoreDoc || scoreDoc.scores.length === 0) continue;
      const matchCount = checkMatch(scoreDoc.scores, draw.winningNumbers);
      if (matchCount === 5) fiveMatches.push(user._id);
      else if (matchCount === 4) fourMatches.push(user._id);
      else if (matchCount === 3) threeMatches.push(user._id);
    }

    // Prize pool calculation (dummy for now)
    const totalPool = 500;
    const jackpot = fiveMatches.length > 0 ? totalPool * 0.4 : 0;
    const fourPool = totalPool * 0.35;
    const threePool = totalPool * 0.25;

    draw.totalPrizePool = totalPool;
    draw.jackpotAmount = jackpot;
    draw.fourMatchAmount = fourPool;
    draw.threeMatchAmount = threePool;
    draw.jackpotRolledOver = fiveMatches.length === 0;
    draw.status = 'published';

    const createWinners = async (userIds, matchType, pool) => {
      const prizeEach = splitPrize(pool, userIds.length);
      for (const userId of userIds) {
        await Winner.create({
          user: userId, draw: draw._id, matchType, prizeAmount: prizeEach,
        });
        draw.winners.push({ user: userId, matchType, prizeAmount: prizeEach });
      }
    };

    if (fiveMatches.length > 0) await createWinners(fiveMatches, '5-match', jackpot);
    await createWinners(fourMatches, '4-match', fourPool);
    await createWinners(threeMatches, '3-match', threePool);

    await draw.save();
    res.json({ message: 'Draw published', draw });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getWinners = async (req, res) => {
  try {
    const winners = await Winner.find({ verificationStatus: 'approved' })
      .populate('user', 'name')
      .populate('draw', 'month year')
      .sort({ createdAt: -1 });
    res.json(winners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { getDraws, getLatestDraw, simulateDraw, publishDraw, getWinners };