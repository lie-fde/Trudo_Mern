import {
  countDonations,
  findDonationsPaginated,
  DonationRepository,
} from "../repositories/DonationRepository.js";

export const getDonationHistoryService = async (
  userId,
  page,
  limit,
  search
) => {
  const skip = (page - 1) * limit;

  const history = await findDonationsPaginated(userId, skip, limit, search);

  const total = await countDonations(userId, search);

  return {
    history,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const getDonationStatsService = async (userId) => {
  return await DonationRepository.getDonationStats(userId);
};

