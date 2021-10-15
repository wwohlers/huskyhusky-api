export declare class EmailService {
    private transporter;
    sendMail(to: string[], subject: string, content: string): Promise<void>;
}
