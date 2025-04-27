import type { EventFormData, EventValidationError, EventValidationResult } from '@/types/event';

export class EventValidator {
    private static validateTitle(title: string): EventValidationError | null {
        if (!title) {
            return { field: 'title', message: 'Title is required' };
        }
        if (title.length < 2) {
            return { field: 'title', message: 'Title must be at least 2 characters long' };
        }
        if (title.length > 100) {
            return { field: 'title', message: 'Title cannot exceed 100 characters' };
        }
        return null;
    }

    private static validateDates(start: string, end: string | null): EventValidationError | null {
        if (!start) {
            return { field: 'start', message: 'Start date is required' };
        }

        const startDate = new Date(start);
        if (isNaN(startDate.getTime())) {
            return { field: 'start', message: 'Invalid start date format' };
        }

        if (end) {
            const endDate = new Date(end);
            if (isNaN(endDate.getTime())) {
                return { field: 'end', message: 'Invalid end date format' };
            }
            if (endDate < startDate) {
                return { field: 'end', message: 'End date must be after start date' };
            }
        }

        return null;
    }

    private static validateTurnDetails(eventData: EventFormData): EventValidationError | null {
        if (eventData.turn) {
            if (!eventData.turndate) {
                return { field: 'turndate', message: 'Turn date is required for turn events' };
            }

            const turnDate = new Date(eventData.turndate);
            if (isNaN(turnDate.getTime())) {
                return { field: 'turndate', message: 'Invalid turn date format' };
            }

            if (eventData.turncheckintime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(eventData.turncheckintime)) {
                return { field: 'turncheckintime', message: 'Invalid check-in time format (HH:MM)' };
            }

            if (eventData.turncheckouttime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(eventData.turncheckouttime)) {
                return { field: 'turncheckouttime', message: 'Invalid check-out time format (HH:MM)' };
            }
        }
        return null;
    }

    private static validateContactInfo(eventData: EventFormData): EventValidationError | null {
        if (eventData.contactnumber && !/^\+?[\d\s-]{8,}$/.test(eventData.contactnumber)) {
            return { field: 'contactnumber', message: 'Invalid contact number format' };
        }
        return null;
    }

    private static validateNotes(eventData: EventFormData): EventValidationError | null {
        if (eventData.eventnotes && eventData.eventnotes.length > 500) {
            return { field: 'eventnotes', message: 'Notes cannot exceed 500 characters' };
        }
        return null;
    }

    private static validateColor(color: string | undefined): EventValidationError | null {
        if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
            return { field: 'color', message: 'Invalid color format (must be hex color code)' };
        }
        return null;
    }

    public static validateEvent(eventData: EventFormData): EventValidationResult {
        const errors: EventValidationError[] = [];

        // Validate required fields
        const titleError = this.validateTitle(eventData.title);
        if (titleError) errors.push(titleError);

        // Validate dates
        const datesError = this.validateDates(eventData.start, eventData.end);
        if (datesError) errors.push(datesError);

        // Validate turn details if it's a turn event
        const turnDetailsError = this.validateTurnDetails(eventData);
        if (turnDetailsError) errors.push(turnDetailsError);

        // Validate optional fields
        const contactError = this.validateContactInfo(eventData);
        if (contactError) errors.push(contactError);

        const notesError = this.validateNotes(eventData);
        if (notesError) errors.push(notesError);

        const colorError = this.validateColor(eventData.color);
        if (colorError) errors.push(colorError);

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    public static getErrorMessage(field: keyof EventFormData): string {
        const errorMessages: Record<keyof EventFormData, string> = {
            title: 'Please enter a valid title',
            start: 'Please select a valid start date',
            end: 'Please select a valid end date',
            allDay: 'Invalid all-day setting',
            houseId: 'Please select a house',
            color: 'Please select a valid color',
            eventnotes: 'Notes are too long',
            turn: 'Invalid turn setting',
            turndate: 'Please select a valid turn date',
            turncheckintime: 'Please enter a valid check-in time',
            turncheckouttime: 'Please enter a valid check-out time',
            address: 'Please enter a valid address',
            contactnumber: 'Please enter a valid contact number'
        };

        return errorMessages[field] || 'Invalid field value';
    }
} 