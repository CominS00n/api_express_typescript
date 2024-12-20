import { subjectEnum } from "../types/enum";
import { ApprovalData, UserRequestData } from "../types";

const switchMessage = async (
  subject: string,
  approvalData: ApprovalData,
  userData: UserRequestData,
  token: string
) => {
  const head = `
  <head>
    <meta charset="utf-8">
    <style amp4email-boilerplate>body{visibility:hidden}</style>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
  </head>
  `;
  const footer = `
    <p>ขอแสดงความนับถือ,</p>
    <p>NT National Telecom</p>
  `;

  switch (subject) {
    case subjectEnum.REQUEST:
      return `
      <html>
       ${head}
       <body>
       <h3>
           มีคำขอสร้างบัญชีผู้ใช้ (RTC Request Account)
           ที่ต้องการการอนุมัติจากท่าน
       </h3>
       <div>
           <p>รายละเอียดคำขอ:</p>
           <p>ชื่อผู้ขอ: ${userData.user_name}</p>
           <p>อีเมลผู้ขอ: ${userData.user_email}</p>
           <p>วันที่ส่งคำขอ: ${userData.user_date?.toDateString()}</p>
       </div>
       <p>กรุณาดำเนินการอนุมัติคำขอผ่านลิงก์ด้านล่าง:</p>
       <a style="
            background-color: #facc15;
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            text-decoration: none;
            color: #333;
            font-weight: bold;
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
              sans-serif;
          "
          href="http://localhost:3000/approval/${token}"
        >
          Approved Request Account (RTC)
       </a>
       <p>
           โปรดทราบว่าการอนุมัติต้องดำเนินการภายใน 24 ชั่วโมง หากไม่ดำเนินการ
           คำขอจะถูกยกเลิกโดยอัตโนมัติ
       </p>
        ${footer}
       </body>
       </html>
       `;
    case subjectEnum.WAITING:
      return ` 
        <html>
         <head>
         <meta charset="utf-8">
         <style amp4email-boilerplate>body{visibility:hidden}</style>
         <script async src="https://cdn.ampproject.org/v0.js"></script>
         </head>
         <body>
         <h3>ติดตามคำขอสร้างบัญชีผู้ใช้ (RTC Request Account)</h3>
         <p>คำขอของท่านอยู่ระหว่างรออนุมัติ</p>
         <div>
          <p>รายละเอียดคำขอ:</p>
          <p>ชื่อผู้ขอ: ${userData.user_name}</p>
          <p>อีเมลผู้ขอ: ${userData.user_email}</p>
          <p>วันที่ส่งคำขอ: ${userData.user_date}</p>
         </div>
         <a style="
            background-color: #facc15;
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            text-decoration: none;
            color: #333;
            font-weight: bold;
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
              sans-serif;
          "
           href="http://localhost:3000/tacking/${approvalData.acc_req_id}">
             ติดตามคำขอสร้างบัญชีผู้ใช้ (RTC Request Account)
         </a>
         <p>ขอแสดงความนับถือ,</p>
         <p>NT National Telecom</p>
         </body>
         </html>
         `;
    case subjectEnum.UPDATE:
      return `
      <html>
         <head>
         <meta charset="utf-8">
         <style amp4email-boilerplate>body{visibility:hidden}</style>
         <script async src="https://cdn.ampproject.org/v0.js"></script>
         </head>
         <body>
         <h3>สถานะคำของสร้างบัญชีผู้ใช้ (RTC Request Account)</h3>
         <p>คำขอของท่านได้รับอนุมัติโดย ${approvalData.name}</p>
         <div>
          <p>รายละเอียดคำขอ:</p>
          <p>ชื่อผู้ขอ: ${userData.user_name}</p>
          <p>อีเมลผู้ขอ: ${userData.user_email}</p>
          <p>วันที่ส่งคำขอ: ${userData.user_date}</p>
         </div>
         <p>หมายเหตุ:</p>
         <p>${approvalData.remark}</p>
         <a style="
            background-color: #facc15;
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            text-decoration: none;
            color: #333;
            font-weight: bold;
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
              sans-serif;
          "
           href="http://localhost:3000/tacking/${approvalData.acc_req_id}">
             ติดตามคำขอสร้างบัญชีผู้ใช้ (RTC Request Account)
         </a>
         <p>ขอแสดงความนับถือ,</p>
         <p>NT National Telecom</p>
         </body>
         </html>
      `;
    case subjectEnum.REJECT:
      return `
      <html>
         <head>
         <meta charset="utf-8">
         <style amp4email-boilerplate>body{visibility:hidden}</style>
         <script async src="https://cdn.ampproject.org/v0.js"></script>
         </head>
         <body>
         <h3>สถานะคำของสร้างบัญชีผู้ใช้ (RTC Request Account)</h3>
         <p>คำขอของท่านถูกปฏิเสธโดย ${approvalData.name}</p>
         <div>
          <p>รายละเอียดคำขอ:</p>
          <p>ชื่อผู้ขอ: ${userData.user_name}</p>
          <p>อีเมลผู้ขอ: ${userData.user_email}</p>
          <p>วันที่ส่งคำขอ: ${userData.user_date}</p>
         </div>
         <p>หมายเหตุ:</p>
         <p>${approvalData.remark}</p>
         <a style="
            background-color: #facc15;
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            text-decoration: none;
            color: #333;
            font-weight: bold;
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
              sans-serif;
          "
           href="http://localhost:3000/tacking/${approvalData.acc_req_id}">
             ตรวสอบคำขอสร้างบัญชีผู้ใช้ (RTC Request Account)
         </a>
         <p>ขอแสดงความนับถือ,</p>
         <p>NT National Telecom</p>
         </body>
         </html>
      `;
    case subjectEnum.APPROVED:
      return `
      <html>
         <head>
         <meta charset="utf-8">
         <style amp4email-boilerplate>body{visibility:hidden}</style>
         <script async src="https://cdn.ampproject.org/v0.js"></script>
         </head>
         <body>
         <h3>สถานะคำของสร้างบัญชีผู้ใช้ (RTC Request Account)</h3>
         <p>คำขอของท่านได้รับอนุมัติแล้ว</p>
         <div>
          <p>รายละเอียดคำขอ:</p>
          <p>ชื่อผู้ขอ: ${userData.user_name}</p>
          <p>อีเมลผู้ขอ: ${userData.user_email}</p>
          <p>วันที่ส่งคำขอ: ${userData.user_date}</p>
         </div>
         <p>หมายเหตุ:</p>
         <p>${approvalData.remark}</p>
         <a style="
            background-color: #facc15;
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            text-decoration: none;
            color: #333;
            font-weight: bold;
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
              sans-serif;
          "
           href="http://localhost:3000/tacking/${approvalData.acc_req_id}">
             ตรวสอบคำขอสร้างบัญชีผู้ใช้ (RTC Request Account)
         </a>
         <p>ขอแสดงความนับถือ,</p>
         <p>NT National Telecom</p>
         </body>
         </html>
      `;
    default:
      return "";
  }
};
export const createMail = async (
  cc: string[],
  subject: string,
  approvalData: ApprovalData,
  userData: UserRequestData,
  token: string
) => {
  const from: string = process.env.MAIL_USERNAME?.toString() || "";
  const html = await switchMessage(subject, approvalData, userData, token);

  let MailMessage = {
    from: `NT National Telecom  <${from}>`,
    to:
      subject === subjectEnum.REQUEST 
        ? approvalData.email
        : userData.user_email,
    subject: `${subject} - (คุณ ${userData.user_name})`,
    text: `เรียนคุณ ${approvalData.name}`,
    cc: cc,
    html: html,
  };
  return MailMessage;
};
