import { model, Schema } from "mongoose";
import Joi from "joi";
import { RoleInterface } from "../interface/role.interface";


//validation schema
export const RoleSchemaValidate = Joi.object({
  name: Joi.string().required().min(3),
});

const RoleSchema = new Schema<RoleInterface>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
  },
  { timestamps: true }
);

const RoleModel = model<RoleInterface>("Role", RoleSchema);

export { RoleModel };
