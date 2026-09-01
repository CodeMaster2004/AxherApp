import { Clapperboard, CreditCard, LucideIcon, Settings, User, Wallet, Lock, HelpCircle } from "lucide-react";

export const supportFaqCategoryIcons: Record<string, LucideIcon> = {

    ACCOUNT: User,
    SUBSCRIPTION: CreditCard,
    PAYMENT: Wallet,
    CONTENT: Clapperboard,
    TECHNICAL: Settings,
    SECURITY: Lock,
}

export const defaultSupportFaqCategoryIcon = HelpCircle;