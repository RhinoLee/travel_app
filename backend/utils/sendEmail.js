const sgMail = require('@sendgrid/mail');
const mjml2html = require("mjml");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (mail, token, cate) => new Promise(async (resolve, reject) => {
  let receiveDomain = ""
  let msg = null

  if (cate === "verifyEmail") {
    receiveDomain = process.env.NODE_ENV === "development" ? "http://localhost:3003/verifyEmail/" : "https://travel.rhinoman.com.tw/verifyEmail/"

    // made email html
    const mjmlToHtml = mjml2html(`
    <mjml>
      <mj-body background-color="#fafafa">
        <mj-section>
          <mj-column></mj-column>
        </mj-section>
        <mj-section border-radius="5px 5px 0 0" padding-bottom="120px" background-url="https://storage.googleapis.com/rhinoman-travel-bucket/email/img_emailbg.png" background-size="cover" background-repeat="no-repeat">
        </mj-section>
        
        <mj-section border-radius="0px 0px 5px 5px" background-color="#ffffff">
          <mj-column>
            <mj-text font-size="18px" line-height="12px" letter-spacing="1px" color="#000000">歡迎來到旅行筆記</mj-text>
            <mj-text font-size="18px" line-height="12px" letter-spacing="1px" color="#000000">請先驗證您的信箱</mj-text>
            <mj-text letter-spacing="1px" line-height="22px" color="#525252">已收到您的註冊資訊，請點擊下方驗證信箱連結，已完成驗證程序，謝謝。</mj-text>
            <mj-text padding-top="18px"></mj-text>
            <mj-button href="${receiveDomain}?token=${token}" letter-spacing="3px" background-color="#145049" href="#">驗證信箱</mj-button>
          </mj-column>
        </mj-section>
    
        <mj-section>
          <mj-column>
            <mj-text color="#c55252" padding-top="18px" letter-spacing="3px" align="center">請勿直接回覆本信件</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
  </mjml>
  `);

    // setting email
    msg = {
      to: mail,
      from: {
        name: '旅行筆記',
        email: 'picklerhino@gmail.com'
      },
      subject: 'Welcome to Travel Note! Confirm Your Email',
      html: mjmlToHtml.html
      // html: `
      // <h2>歡迎來到旅行筆記!<br/>
      // 請先驗證您的信箱</h2>

      // <p>已收到您的註冊資訊，請點擊下方驗證信箱連結，已完成驗證程序，謝謝。</p>

      // <div>
      //   驗證信箱連結：<a href="${receiveDomain}?token=${token}">${receiveDomain}?token=${token}</a>
      // </div>
      // `,
    };
  }

  if (cate === "resetPassword") {
    receiveDomain = process.env.NODE_ENV === "development" ? "http://localhost:3003/resetPassword/" : "https://travel.rhinoman.com.tw/resetPassword/"

    // made email html
    const mjmlToHtml = mjml2html(`
    <mjml>
      <mj-body background-color="#fafafa">
        <mj-section>
          <mj-column></mj-column>
        </mj-section>
        <mj-section border-radius="5px 5px 0 0" padding-bottom="120px" background-url="https://storage.googleapis.com/rhinoman-travel-bucket/email/img_emailbg.png" background-size="cover" background-repeat="no-repeat">
        </mj-section>
        
        <mj-section border-radius="0px 0px 5px 5px" background-color="#ffffff">
          <mj-column>
            <mj-text font-size="18px" line-height="12px" letter-spacing="1px" color="#000000">歡迎來到旅行筆記</mj-text>
            <mj-text letter-spacing="1px" line-height="22px" color="#525252">已收到您的重設密碼要求，請點擊下方重設密碼連結，完成重設密碼程序，謝謝。</mj-text>
            <mj-text padding-top="18px"></mj-text>
            <mj-button href="${receiveDomain}?token=${token}" letter-spacing="3px" background-color="#145049" href="#">重設密碼</mj-button>
          </mj-column>
        </mj-section>

        <mj-section>
          <mj-column>
            <mj-text color="#c55252" padding-top="18px" letter-spacing="3px" align="center">請勿直接回覆本信件</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
    `);

    msg = {
      to: mail,
      from: {
        name: '旅行筆記',
        email: 'picklerhino@gmail.com'
      },
      subject: 'Welcome to Travel Note! Reset Your Password',
      html: mjmlToHtml.html
      // html: `
      // <p>已收到您的重設密碼要求，請點擊下方重設密碼連結，已完成重設密碼程序，謝謝。</p>

      // <div>
      //   重設密碼連結：<a href="${receiveDomain}?token=${token}">${receiveDomain}?token=${token}</a>
      // </div>
      // `,
    };
  }

  try {
    await sgMail.send(msg);
    return resolve(true)

  } catch (error) {
    if (error.response) {
      console.error("sendgrid error", error.response.body)
      return reject(error.response.body)
    }
    return reject(error)
  }
})

module.exports = sendEmail