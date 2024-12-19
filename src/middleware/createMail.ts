type ApprovalData = {
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
type UserRequestData = {
  user_name: string;
  user_email: string;
  user_date: Date | null;
};

enum subjectEnum {
  NEW = "New Request Account (RTC)",
  OLD = "Tracking Request Account (RTC)",
}
export const createMail = async (
  cc: string[],
  subject: string,
  //   html: string,
  approvalData: ApprovalData,
  userData: UserRequestData,
  token: string
) => {
  const from: string = process.env.MAIL_USERNAME?.toString() || "";
  if (subject === subjectEnum.NEW) {
    let MailMessage = {
      from: `NT National Telecom  <${from}>`,
      to: `${approvalData.email}`,
      subject: `${subject}`,
      text: `เรียนคุณ ${approvalData.name}`,
      cc: cc,
      // html: "<p>For clients that do not support AMP4EMAIL or amp content is not valid</p>",
      html: `
       <html>
       <head>
       <meta charset="utf-8">
       <style amp4email-boilerplate>body{visibility:hidden}</style>
       <script async src="https://cdn.ampproject.org/v0.js"></script>
       </head>
       <body>
       <h3>
           มีคำขอสร้างบัญชีผู้ใช้ (RTC Request Account)
           ที่ต้องการการอนุมัติจากท่าน
       </h3>
       <div>
           <p>รายละเอียดคำขอ:</p>
           <p>ชื่อผู้ขอ: ${userData.user_name}</p>
           <p>อีเมลผู้ขอ: ${userData.user_email}</p>
           <p>วันที่ส่งคำขอ: ${userData.user_date}</p>
       </div>
       <p>กรุณาดำเนินการอนุมัติคำขอผ่านลิงก์ด้านล่าง:</p>
       <a style="
               background-color: #facc15;
               padding: 12px 24px;
               border: none;
               border-radius: 10px;
           " href="http://localhost:3000/approval/${token}">
           Approved Request Account (RTC)
       </a>
       <p>
           โปรดทราบว่าการอนุมัติต้องดำเนินการภายใน 24 ชั่วโมง หากไม่ดำเนินการ
           คำขอจะถูกยกเลิกโดยอัตโนมัติ
       </p>
    
       <p>ขอแสดงความนับถือ,</p>
       <p>NT National Telecom</p>
       </body>
       </html>
       `,
    };
    return MailMessage;
  } else {
    let MailMessage = {
      from: `NT National Telecom  <${from}>`,
      to: `${approvalData.email}`,
      subject: `${subject}`,
      text: `เรียนคุณ ${approvalData.name}`,
      cc: cc,
      html: `
         <html>
         <head>
         <meta charset="utf-8">
         <style amp4email-boilerplate>body{visibility:hidden}</style>
         <script async src="https://cdn.ampproject.org/v0.js"></script>
         </head>
         <body>
         <h3>ติดตามคำขอสร้างบัญชีผู้ใช้ (RTC Request Account)</h3>
         <p>คำขอของท่านอยู่ระหว่างรออนุมัติ</p>
         <a style="
                 background-color: #facc15;
                 padding: 6px 12px;
                 border: none;
                 border-radius: 8px;
             " href="http://localhost:3000/tacking/${approvalData.acc_req_id}">
             ติดตามคำขอสร้างบัญชีผู้ใช้ (RTC Request Account)
         </a>
         <p>ขอแสดงความนับถือ,</p>
         <p>NT National Telecom</p>
         </body>
         </html>
         `,
    };
    return MailMessage;
  }
};
