import Employee from '../models/Employee';

/**
 * Generates a unique Employee ID in the format EMP001, EMP002, etc.
 * It counts the total number of employees and increments the count.
 * 
 * @returns {Promise<string>} A new unique Employee ID.
 */
export const generateEmployeeId = async (): Promise<string> => {
    try {
        const count = await Employee.countDocuments();
        const nextId = count + 1;
        // Pad the number with zeros to ensure it's 3 digits (e.g., 001)
        const idString = nextId.toString().padStart(3, '0');
        return `EMP${idString}`;
    } catch (error) {
        console.error('Error in generating employeeId:', error);
        throw new Error('Failed to generate employee ID');
    }
};

/**
 * Formats a date to YYYY-MM-DD string.
 * 
 * @param {Date} date The date to format.
 * @returns {string} Formatted date string.
 */
export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

/**
 * Calculates net salary based on base salary, bonuses, and deductions.
 * 
 * @param {number} base Base salary
 * @param {number} bonuses Total bonuses
 * @param {number} deductions Total deductions
 * @returns {number} The calculated net salary
 */
export const calculateNetSalary = (base: number, bonuses: number, deductions: number): number => {
    return base + bonuses - deductions;
};

/**
 * Calculates the total hours between two dates.
 * 
 * @param {Date} start Start time (Check-in)
 * @param {Date} end End time (Check-out)
 * @returns {number} Total hours rounded to 2 decimal places
 */
export const calculateTotalHours = (start: Date, end: Date): number => {
    const diffMs = end.getTime() - start.getTime();
    return parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
};
