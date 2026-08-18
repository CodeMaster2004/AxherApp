export enum SenderType {
    USER = "USER",
    AGENT = "AGENT",
    SYSTEM = "SYSTEM",
    BOT = "BOT"
}


export interface SupportMessageResponse {
    messageId: number;
    message: string;
    senderType: SenderType;
    senderUserId: number | null;
    sentAt: string;
}


export interface SupportMessageRequest {
    message: string;
}