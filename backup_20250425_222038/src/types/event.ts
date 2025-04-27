export interface EventBase {
    id: string;
    userId: string;
    title: string;
    start: string;
    end: string | null;
    allDay?: boolean;
    extendedProps: {
        houseId?: string;
        color?: string;
        eventnotes?: string;
        turn?: boolean;
        turndate?: string;
        turncheckintime?: string;
        turncheckouttime?: string;
        address?: string;
        contactnumber?: string;
    };
}

export interface EventExtendedProps {
    houseId?: string;
    color?: string;
    eventnotes?: string;
    turn?: boolean;
    turndate?: string;
    turncheckintime?: string;
    turncheckouttime?: string;
    address?: string;
    contactnumber?: string;
}

export interface EventFormData {
    title: string;
    start: string;
    end: string | null;
    allDay?: boolean;
    houseId?: string;
    color?: string;
    eventnotes?: string;
    turn?: boolean;
    turndate?: string;
    turncheckintime?: string;
    turncheckouttime?: string;
    address?: string;
    contactnumber?: string;
}

export interface EventUpdateData extends Partial<EventFormData> {
    id: string;
}

export interface EventCreateResponse {
    id: string;
    success: boolean;
    error?: string;
}

export interface EventUpdateResponse {
    success: boolean;
    error?: string;
}

export interface EventDeleteResponse {
    success: boolean;
    error?: string;
}

export interface EventValidationError {
    field: keyof EventFormData;
    message: string;
}

export interface EventValidationResult {
    isValid: boolean;
    errors: EventValidationError[];
}

export interface EventFilters {
    userId?: string;
    houseId?: string;
    dateRange?: {
        start: string;
        end: string;
    };
}

export interface EventStats {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
}

export interface EventTimeRange {
    start: string;
    end: string;
}

export interface EventFilterOptions {
    userId?: string;
    houseId?: string;
    dateRange?: EventTimeRange;
} 