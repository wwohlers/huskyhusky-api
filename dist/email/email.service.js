"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: 'thehuskyhuskynews@gmail.com',
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    async sendMail(to, subject, content) {
        const info = await this.transporter.sendMail({
            from: '"The Husky Husky" <thehuskyhuskynews@gmail.com>',
            to: to,
            subject: subject,
            html: content
        });
        console.log("Message sent: %s", info.messageId);
    }
};
EmailService = __decorate([
    common_1.Injectable()
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map