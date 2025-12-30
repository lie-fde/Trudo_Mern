import { getMonthlyDonationGraphRepo } from "../repositories/DonatioGraphRepo.js";

export const getMonthlyDonationGraphService = async () => {
  const rawData = await getMonthlyDonationGraphRepo();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return months.map((month, index) => {
    const found = rawData.find((d) => d._id === index + 1);

    return {
      month,
      amount: found ? found.amount : 0,
      count: found ? found.count : 0,
    };
  });
};
