import pick from "lodash.pick";
import { BASE_RESPONSE_FIELDS } from "../cores/constants/base-response-fields.constant";

export const getInfoData = <T>({
  fields,
  object,
}: {
  fields: readonly (keyof T)[];
  object: any;
}): T => {
  const finalFields = [...fields, ...BASE_RESPONSE_FIELDS] as (keyof T)[];
  return pick(object, finalFields) as T;
};
