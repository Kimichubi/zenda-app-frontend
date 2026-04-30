export { useUser, useUpdateProfile } from "./use-auth";
export { useClients, useCreateClient, useUpdateClient, useDeleteClient } from "./use-clients";
export { 
    useAppointments, 
    useWeekAppointments, 
    useCreateAppointment, 
    useUpdateAppointment,
    useUpdateAppointmentStatus, 
    useResendNotification 
} from "./use-appointments";
export { usePayments, useGeneratePix, useMarkPaid, useCancelPayment } from "./use-payments";
export { useDashboard } from "./use-dashboard";
export { useServices, useCreateService, useUpdateService, useDeleteService } from "./use-services";
export { useAdminUsers, useAdminStats, useUpdateUserPlan } from "./use-admin";
export { useSiteSettings, useUpdateSiteSettings } from "./use-site-settings";
export { useBookingServices, useAvailableSlots, useCreateBooking } from "./use-booking";
export { useWhatsappStatus, useWhatsappQR, useConnectWhatsapp, useLogoutWhatsapp, useChatSessions, useChatLogs, useChatStats, useResetChatSession } from "./use-whatsapp";
export { 
    useStaff, 
    useAddStaff,
    useRemoveStaff,
    useProducts, 
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
    useLowStockProducts,
    useInventoryMovements,
    useRestock,
    useCategories,
    useCreateCategory,
    useDeleteCategory,
    useCommissions,
    usePayCommissions,
    useCheckout,
    useCheckoutAppointment,
    useTipSuggestions,
    useAddClientCredit,
    useClientCredit,
    useRedeemPoints,
    useUpdateLoyalty,
} from "./use-enterprise";