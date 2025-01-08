export type Event = {
    id: string;
    title: string;
    date: string;
    location?: string;
    description?: string;
    startTime: string;
    endTime: string;
};

export type Calendar = {
    id: string;
    name: string;
    isChecked?: boolean;
};

export type CalendarEvent = {
    title: string;
    date: string;
    location?: string;
    description?: string;
    startTime: string;
    endTime: string;
};

export type ExtendedCalendar = Calendar & {
    id: string;
    isChecked: boolean;
};