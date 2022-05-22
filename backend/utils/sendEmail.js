const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (mail, token) => new Promise(async (resolve, reject) => {
  const receiveDomain = process.env.NODE_ENV === "development" ? "http://localhost:3003/verifyEmail/" : "https://travel.rhinoman.com.tw/verifyEmail/"
  const msg = {
    to: mail,
    from: {
      name: '旅行筆記',
      email: 'picklerhino@gmail.com'
    },
    subject: 'Welcome to travel rhinoman! Confirm Your Email',
    html: `
    <h2>歡迎來到旅行筆記!<br/>
    請先驗證您的信箱</h2>

    <p>已收到您的註冊資訊，請點擊下方驗證信箱連結，已完成驗證程序，謝謝。</p>

    <div>
      驗證信箱連結：<a href="${receiveDomain}?token=${token}">${receiveDomain}?token=${token}</a>
    </div>
    `,
  };

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