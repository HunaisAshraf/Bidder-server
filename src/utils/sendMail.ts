import nodemailer from "nodemailer";
import { ErrorResponse } from "./errors";
import { Auction } from "../entities/auction";

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
  } catch (error: any) {
    console.log(error);
    throw new ErrorResponse(error.message, error.status);
  }
};

export const sendAuctionMail = async (
  name: string,
  email: string,
  auction: Auction
) => {
  try {
    console.log("mail sending...");
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
      subject: `🌟 Auction Alert: Bid Now for ${auction.itemName}`,
      html: `
      <p>Hi ${name}</p>
      <p>Guess what? The auction for ${auction.itemName} is officially live on our site! 🎉</p><br /> 
      <img height='200' src=${auction.images[0]} /> <br />
      <p>Now's your chance to snag ${auction.itemName} at a great price. Get in there, place your bid, and let the bidding war begin!</p> <br/>
      <h3>Here are the deets:</h3>
      <ul>
      <li>Item: ${auction.itemName}</li>
      <li>Start Date: ${auction.startDate}</li>
      <li>End Date: ${auction.endDate}</li>
      <li>Current Bid: ${auction.currentBid}</li>
      </ul><br/>
      <p>Click this link to jump straight to the action: <a href="${process.env.MAIL_LINK}/auctions/${auction._id}"a> Click Here! </a> </p><br />
      <p>Happy BIdding!</p>
      `,
    });
    console.log("mail successful");
    return info;
  } catch (error: any) {
    console.log(error);
    throw new ErrorResponse(error.message, error.status);
  }
};
