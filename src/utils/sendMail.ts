import nodemailer from "nodemailer";

export const sendMail = async (
  name: string,
  email: string,
  type: string,
  token: string
) => {
  try {
    console.log("otp sending...");
      // const transporter = nodemailer.createTransport({
      //   host: "smtp.gmail.com",
      //   port: 587,
      //   secure: false,
      //   auth: {
      //     user: process.env.EMAIL,
      //     pass: process.env.PASSWORD,
      //   },
      // });

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: '"Bidder "<bidder@gmail.com>',
      to: `${email}`,
      subject:
        type === "verifyEmail" ? "Account verification" : "Reset Password",
      html: `<h2>Hi ${name}</h2><br/>
      <p>Click this <a href="${
        process.env.MAIL_LINK
      }/verifyemail?type=${type}&token=${token}&email=${email}"> link </a>to ${
        type === "verifyEmail" ? "verify your account " : "reset password"
      } 
      
      </p><h4> </h4>`,
    });
    console.log("otp successful");
    return info;
  } catch (error) {
    console.log(error);
  }
};
