const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
};

const sendWhatsAppMessage = async (to, message) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:+91${to}` // Assuming Indian phone numbers
        });
        return response;
    } catch (error) {
        console.error('Twilio WhatsApp Error:', error);
        throw error;
    }
};

const sendLeaveRequestToParent = async (parentPhone, studentName, startDate, endDate, reason) => {
    const timeOfDay = getTimeOfDay();
    const message = `Good ${timeOfDay}!\n\nYour ward ${studentName} has requested leave from ${startDate} to ${endDate}.\n\nReason: ${reason}\n\nPlease reply with:\nYES to approve\nNO to reject`;
    
    return sendWhatsAppMessage(parentPhone, message);
};

const sendAbsenceAlert = async (parentPhone, studentName, currentTime) => {
    const timeOfDay = getTimeOfDay();
    const message = `Good ${timeOfDay}!\n\nThis is to inform you that your ward ${studentName} was not present in the hostel during the attendance check at ${currentTime}.\n\nPlease contact the hostel administration for more information.`;
    
    return sendWhatsAppMessage(parentPhone, message);
};

const sendLeaveApprovalStatus = async (studentPhone, status, startDate, endDate) => {
    const timeOfDay = getTimeOfDay();
    const message = `Good ${timeOfDay}!\n\nYour leave request from ${startDate} to ${endDate} has been ${status}.\n\nPlease check your dashboard for more details.`;
    
    return sendWhatsAppMessage(studentPhone, message);
};

module.exports = {
    sendWhatsAppMessage,
    sendLeaveRequestToParent,
    sendAbsenceAlert,
    sendLeaveApprovalStatus
}; 