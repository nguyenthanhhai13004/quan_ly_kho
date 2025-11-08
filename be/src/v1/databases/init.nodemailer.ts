import nodemailer from "nodemailer";
import { nodemailerConfig } from "../configs/nodemailer.config";
export type EmailOptionsType = {
    to:string;
    subject:string;
    html:string;
    text:string;
}
const transporter = nodemailer.createTransport(nodemailerConfig);
export default transporter;