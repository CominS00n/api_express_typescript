import { userViews } from "../models/view_table/user_views";
import { db } from "../config/connect";
import { eq } from "drizzle-orm";

export const ccMail = async () => {
  let ccData: any[] = ["rtc_oper@ntplc.co.th"];
  try {
    const cc = await db
      .select({
        user_email: userViews.user_email,
      })
      .from(userViews)
      .where(eq(userViews.role_name, "super_admin"))
      .execute();
    ccData.push(...cc.map((item: any) => item.user_email));
    return ccData;
  } catch (error) {
    console.error("Error getting cc email:", error);
    return;
  }
};

