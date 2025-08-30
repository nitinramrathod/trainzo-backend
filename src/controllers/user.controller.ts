import UserModel from "../models/user.model";
import { FastifyRequest, FastifyReply } from "fastify";
import { validateUser } from "../validation-schema/user.validation";
import bodyParser from "../helper/common/bodyParser";
import { formatHumanDate } from "../helper/formatHumanDate";
import { successResponse } from "../helper/response";
import getPaginationMeta from "../helper/metaPagination";
import addMonths from "../helper/dates/addMonths";
import { IUserResponse } from "../types/user.interface";
import { regexFilter } from "../utils/regexFilter";

async function getAll(request: FastifyRequest, reply: FastifyReply) {
  try {
    const {
      limit = 10,
      page = 1,
      name,
      contact,
      role,
      gender,
      gym_package
    } = request.query as {
      limit?: number;
      page?: number;
      name?: string;
      contact?: string;
      role?: string;
      gender?: string;
      gym_package?: string;
    };

    let filter: any = {};

    regexFilter("gender", gender, filter);
    regexFilter("contact", contact, filter);
    regexFilter("role", role, filter);
    regexFilter("name", name, filter);
    regexFilter("gym_package", gym_package, filter);

    const users = await UserModel.find(filter)
      .select("-password")
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("gym_package", "name discount_price duration")
      .sort({ createdAt: -1 });

    const transformedUsers = users.map((user: any) => {
      const userObj = user.toObject();
      const discount_price = userObj?.gym_package?.discount_price;
      const paid_fees = userObj?.paid_fees;

      const joiningDate = new Date(userObj?.joining_date || new Date());
      const durationInMonth = userObj?.gym_package?.duration || 0;

      const expiry_date = addMonths(joiningDate, durationInMonth);
      const is_active = expiry_date > new Date();

      return {
        ...userObj,
        joining_date: {
          raw: joiningDate,
          formatted: formatHumanDate(joiningDate, "long"),
        },
        dob: {
          raw: user.dob,
          formatted: formatHumanDate(user.dob, "long"),
        },
        remaining_fees: (discount_price || 0) - (paid_fees || 0),
        expiry_date: {
          raw: expiry_date,
          formatted: formatHumanDate(expiry_date, "long"),
        },
        is_active,
      };
    });

    const meta = await getPaginationMeta(UserModel, filter, page, limit);

    successResponse(
      "User fetch successfully.",
      transformedUsers,
      reply,
      meta,
      200
    );
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch users", details: err });
  }
}

async function getExpiringUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const {
      page = 1,
      limit = 10,
      name,
    } = request.query as {
      page?: number;
      name?: string;
      limit?: number;
    };

    const skip = (page - 1) * limit;
    const now = new Date();
    let matchFilter: any = {};

    if (name) {
      matchFilter.name = { $regex: name, $options: "i" };
    }

     const aggregationPipeline:any[] = [
      { $match: matchFilter },

      {
        $lookup: {
          from: "memberships", // make sure this matches the actual collection name
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
        },
      },
      {
        $addFields: {
          daysLeft: {
            $ceil: {
              $divide: [
                { $subtract: ["$expiry_date", now] },
                1000 * 60 * 60 * 24, // convert ms to days
              ],
            },
          },
        },
      },
      {
        $match: {
          daysLeft: { $lte: 10 },
        },
      },
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                name: 1,
                joining_date: 1,
                expiry_date: 1,
                daysLeft: 1,
                photo:1,
                "gym_package.name": 1,
                "gym_package.duration": 1,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const [result] = await UserModel.aggregate(aggregationPipeline);

    const transformedUser = result?.data?.map((user:any)=>{
      return{
        ...user,
        joining_date: {
          raw: user.joining_date,
          formatted: formatHumanDate(user.joining_date, 'long') 
        },
        expiry_date: {
          raw: user.expiry_date,
          formatted: formatHumanDate(user.expiry_date, 'long') 
        }
      }

    })

    const total_items = result?.totalCount?.[0]?.count || 0;
    const total_pages = Math.ceil(total_items / limit);

    successResponse(
      "Expiring users fetched successfully.",
      transformedUser,
      reply,
       {
        total_items,
        current_page: page,
        total_pages,
        first_page: 1,
        last_page: total_pages,
        limit
      },
      200
    );
  } catch (error) {
    reply
      .status(500)
      .send({ error: "Failed to fetch expiring users", details: error });
  }
}

async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    if (!request.isMultipart()) {
      return reply
        .status(422)
        .send({ error: "Request must be multipart/form-data" });
    }
    const fields:any = await bodyParser(request);

    const {
      name,
      email,
      contact,
      dob,
      address,
      gender,
      photo,
      gym_package,
      workout_package,
      paid_fees,
      joining_date,
      expiry_date,
      role,
      password='123456'
    } = fields;

    console.log('fields===>', fields)
    let isValid = await validateUser(fields, reply);

    if (isValid) {
      return;
    }

    if(email){
      const existing = await UserModel.findOne({ email });
      if (existing) {
      return reply
        .status(409)
        .send({ error: "User with this email already exists" });
      }
    }

    const user = await UserModel.create({
      name,
      email,
      contact,
      dob,
      address,
      gender,
      photo,
      gym_package,
      workout_package,
      paid_fees,
      joining_date,
      expiry_date,
      role,
      password
    });

    reply.status(201).send({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    reply.status(500).send({ error: "Failed to get users " + error });
  }
}

async function update(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    if (!request.isMultipart()) {
      return reply
        .status(422)
        .send({ error: "Request must be multipart/form-data" });
    }
    const fields = await bodyParser(request);

    const {
      name,
      email,
      contact,
      dob,
      address,
      gender,
      photo,
      gym_package,
      workout_package,
      paid_fees,
      joining_date,
      expiry_date,
      password='123456'
    } = fields;

    let isValid = await validateUser(fields, reply);

    if (isValid) {
      return;
    }

    const { id } = request.params;

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
        contact,
        dob,
        address,
        gender,
        photo,
        gym_package,
        workout_package,
        paid_fees,
        joining_date,
        expiry_date,
        password,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return reply.status(404).send({ error: "User not found" });
    }

    reply.status(200).send({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    reply.status(500).send({ error: "Failed to update user", details: err });
  }
}

async function remove(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return reply.status(404).send({ error: "User not found" });
    }

    reply.status(200).send({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (err) {
    reply.status(500).send({ error: "Failed to delete user", details: err });
  }
}

async function getById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    const userRaw = user.toObject();

    const userObj: IUserResponse = {
      ...userRaw,
      _id: (userRaw._id as string | { toString(): string }).toString(),
      dob: userRaw.dob ? formatHumanDate(userRaw.dob, 'numericDash') : undefined,
      joining_date: userRaw.joining_date ? formatHumanDate(userRaw.joining_date, 'numericDash') : undefined,
      expiry_date: userRaw.expiry_date ? formatHumanDate(userRaw.expiry_date, 'numericDash') : undefined
    };

    reply.status(200).send({ data: userObj });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch user", details: err });
  }
}

export default { create, remove, update, getAll, getById, getExpiringUsers };
