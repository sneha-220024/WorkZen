import Schedule, { ISchedule, IScheduleDocument } from '../models/Schedule';
import emailService from './email.service';
import ActivityService from './ActivityService';

/**
 * Service class for Schedule related business logic.
 */
class ScheduleService {
    /**
     * Create a new schedule and notify the employee.
     * @param {Partial<ISchedule>} scheduleData Data for the new schedule.
     * @param {string} hrName Name of the HR who created the schedule.
     * @param {string} hrId ID of the HR who created the schedule.
     * @returns {Promise<IScheduleDocument>} The created schedule.
     */
    static async createSchedule(scheduleData: Partial<ISchedule>, hrName: string, hrId: string): Promise<IScheduleDocument> {
        const schedule = new Schedule(scheduleData);
        const savedSchedule = await schedule.save();

        // Trigger Email Notification (non-blocking)
        const emailSubject = `New Schedule: ${savedSchedule.reason}`;
        const emailHtml = `
            <h2>Hello, ${savedSchedule.employeeName}!</h2>
            <p>You have a new scheduled ${savedSchedule.reason.toLowerCase()}.</p>
            <p><strong>Date:</strong> ${new Date(savedSchedule.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${savedSchedule.time}</p>
            <p><strong>Reason:</strong> ${savedSchedule.reason}</p>
            <p><strong>Meeting Link:</strong> <a href="${savedSchedule.meetingLink}">${savedSchedule.meetingLink}</a></p>
            <br/>
            <p>Please be available at the scheduled time.</p>
            <p>Best regards,</p>
            <p>${hrName} / WorkZen HR Team</p>
        `;

        emailService.sendEmail({
            to: savedSchedule.employeeEmail,
            subject: emailSubject,
            html: emailHtml
        });

        // Log Activity
        await ActivityService.logActivity(
            'schedule_created',
            `${savedSchedule.reason} scheduled for ${savedSchedule.employeeName} by ${hrName}`,
            savedSchedule.employeeName,
            hrId
        );

        return savedSchedule;
    }

    /**
     * Get all schedules (optional, for verification or future use).
     */
    static async getAllSchedules() {
        return await Schedule.find().sort({ date: 1, time: 1 });
    }
}

export default ScheduleService;
