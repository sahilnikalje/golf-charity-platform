const PLAN_PRICES = { monthly: 10, yearly: 100 };
const PRIZE_POOL_PERCENT = 0.5; // 50% of subscription goes to prize pool (remaining splits charity etc.)

const DISTRIBUTION = {
  '5-match': 0.40,
  '4-match': 0.35,
  '3-match': 0.25,
};

const calculatePrizePool = (activeSubscriberCount, planBreakdown) => {
  let totalRevenue = 0;
  if (planBreakdown.monthly) totalRevenue += planBreakdown.monthly * PLAN_PRICES.monthly;
  if (planBreakdown.yearly) totalRevenue += planBreakdown.yearly * (PLAN_PRICES.yearly / 12);
  const prizePool = totalRevenue * PRIZE_POOL_PERCENT;
  return {
    total: prizePool,
    jackpot: prizePool * DISTRIBUTION['5-match'],
    fourMatch: prizePool * DISTRIBUTION['4-match'],
    threeMatch: prizePool * DISTRIBUTION['3-match'],
  };
};

const splitPrize = (amount, winnerCount) => {
  if (winnerCount === 0) return 0;
  return parseFloat((amount / winnerCount).toFixed(2));
};

module.exports = { calculatePrizePool, splitPrize, DISTRIBUTION, PLAN_PRICES };