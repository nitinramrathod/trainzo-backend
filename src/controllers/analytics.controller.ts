import UserModel from "../models/user.model";
import { FastifyRequest, FastifyReply } from "fastify";



async function dashboardStats(request: FastifyRequest, reply: FastifyReply) {
  try {

    const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const [stats] = await UserModel.aggregate([
          {
            $lookup: {
              from: "memberships",
              localField: "gym_package",
              foreignField: "_id",
              as: "gym_package",
            },
          },
          { $unwind: "$gym_package" },

          {
            $addFields: {
              expiry_date: {
                $dateAdd: {
                  startDate: "$joining_date",
                  unit: "month",
                  amount: "$gym_package.duration",
                },
              },
              remainingFee: {
                $max: [
                  { $subtract: ["$gym_package.discount_price", "$paid_fees"] },
                  0,
                ],
              },
            },
          },

          {
            $facet: {
              totalUsers: [{ $count: "count" }],

              activeUsers: [
                { $match: { expiry_date: { $gte: now } } },
                { $count: "count" },
              ],

              totalRevenue: [
                {
                  $match: {
                    updatedAt: { $gte: firstDayOfMonth },
                    paid_fees: { $gt: 0 },
                  },
                },
                { $group: { _id: null, total: { $sum: "$paid_fees" } } },
              ],

              newUsers: [
                {
                  $match: { createdAt: { $gte: lastMonth, $lte: now } },
                },
                { $count: "count" },
              ],

              remainingFees: [
                { $match: { expiry_date: { $gte: now } } },
                {
                  $group: { _id: null, total: { $sum: "$remainingFee" } },
                },
              ],
            },
          },
        ]);

       

        return reply.send({totalUsers: stats?.totalUsers[0]?.count || 0,
          activeUsers: stats?.activeUsers[0]?.count || 0,
          totalRevenue: stats?.totalRevenue[0]?.total || 0,
          newUsers: stats?.newUsers[0]?.count || 0,
          remainingFees: stats?.remainingFees[0]?.total || 0,});

  } catch (err) {
    reply.status(500).send({ error: "Failed to load stats", details: err });
  }
}

export default { dashboardStats };
