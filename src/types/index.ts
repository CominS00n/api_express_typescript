import { activityCode } from "./enum";

export type em = {
  em_name: string;
  em_id: string;
};

export type ApprovalData = {
  name: string;
  id: string;
  email: string;
  date: string | null;
  acc_req_id: string;
  status: "Pending" | "Approved" | "Rejected";
  created_at: Date | null;
  updated_at: Date | null;
  deleted_at: Date | null;
  type: string;
  signature: string | null;
  remark: string | null;
};

export type UserRequestData = {
  user_name: string;
  user_email: string;
  user_date: Date | null;
};

export type LogActivity = {
  activityCode: activityCode;
  activityUser: string;
  activityAction: string;
  activityDetails: string;
};
