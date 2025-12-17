import {
  getAdminDonations,
  exportAdminDonations,
  DonationReportStatsRepo,
} from "../repositories/DonationRepository.js";

export const getAdminDonationReportService = async ({
  page,
  limit,
  search,
  campaignTitle,
  from,
  to,
}) => {
  const skip = (page - 1) * limit;

  const { data, total } = await getAdminDonations({
    skip,
    limit,
    search,
    campaignTitle,
    from,
    to,
  });

  return {
    donations: data,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const exportAdminDonationReportService = async ({
  search,
  campaignTitle,
  from,
  to,
}) => {
  return exportAdminDonations({
    search,
    campaignTitle,
    from,
    to,
  });
};

export const DonationReportStatsService = async () => {
  try {
    const stats = await DonationReportStatsRepo();
    return { success: true, data: stats };
  } catch (error) {
    console.error("Service Error:", error);
    throw new Error("Failed to fetch donation report stats");
  }
};
