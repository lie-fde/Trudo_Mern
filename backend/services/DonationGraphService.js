import { getMonthlyDonationGraphRepo } from "../repositories/DonatioGraphRepo.js";

// export const getMonthlyDonationGraphService = async () => {
//   const rawData = await getMonthlyDonationGraphRepo();

//   const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//   ];

//   return months.map((month, index) => {
//     const found = rawData.find((d) => d._id === index + 1);

//     return {
//       month,
//       amount: found ? found.amount : 0,
//       count: found ? found.count : 0,
//     };
//   });
// };

export const getMonthlyDonationGraphService = async () => {
  const rawData = await getMonthlyDonationGraphRepo();
  const currentYear = new Date().getFullYear();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return months.map((month, index) => {
    const found = rawData.find(
      (d) =>
        d._id.year === currentYear &&
        d._id.month === index + 1
    );

    return {
      year: currentYear,   // ✅ send year to frontend
      month,
      amount: found ? found.amount : 0,
      count: found ? found.count : 0,
    };
  });
};

export const getYearlyDonationGraphService = async () => {
  const rawData = await getMonthlyDonationGraphRepo();

  const yearlyMap = {};

  rawData.forEach(({ _id, amount, count }) => {
    const year = _id.year;

    if (!yearlyMap[year]) {
      yearlyMap[year] = { year, amount: 0, count: 0 };
    }

    yearlyMap[year].amount += amount;
    yearlyMap[year].count += count;
  });

  return Object.values(yearlyMap).sort((a, b) => a.year - b.year);
};
