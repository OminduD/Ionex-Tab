import { CalendarEvent } from '../types';

export const parseICS = (icsContent: string): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const lines = icsContent.split(/\r\n|\n|\r/);

    let currentEvent: Partial<CalendarEvent> | null = null;
    let inEvent = false;

    const parseDate = (dateStr: string): Date => {
        // Format: YYYYMMDDTHHMMSSZ or YYYYMMDD
        if (!dateStr) return new Date();

        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1;
        const day = parseInt(dateStr.substring(6, 8));

        if (dateStr.length === 8) {
            return new Date(year, month, day);
        }

        const hour = parseInt(dateStr.substring(9, 11));
        const minute = parseInt(dateStr.substring(11, 13));
        const second = parseInt(dateStr.substring(13, 15));

        if (dateStr.endsWith('Z')) {
            return new Date(Date.UTC(year, month, day, hour, minute, second));
        }

        return new Date(year, month, day, hour, minute, second);
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('BEGIN:VEVENT')) {
            inEvent = true;
            currentEvent = {
                id: Math.random().toString(36).substr(2, 9), // Temporary ID if UID is missing
            };
            continue;
        }

        if (line.startsWith('END:VEVENT')) {
            if (currentEvent && currentEvent.title && currentEvent.startDate) {
                events.push(currentEvent as CalendarEvent);
            }
            inEvent = false;
            currentEvent = null;
            continue;
        }

        if (!inEvent || !currentEvent) continue;

        // Handle multi-line descriptions (simplified)
        // Real ICS parsing is more complex with folding, but this covers basic cases

        if (line.startsWith('SUMMARY:')) {
            currentEvent.title = line.substring(8);
        } else if (line.startsWith('DESCRIPTION:')) {
            currentEvent.description = line.substring(12);
        } else if (line.startsWith('DTSTART')) {
            // Handle DTSTART;VALUE=DATE:20230101 or DTSTART:20230101T120000Z
            const datePart = line.split(':')[1];
            currentEvent.startDate = parseDate(datePart);
            if (line.includes('VALUE=DATE')) {
                currentEvent.allDay = true;
            }
        } else if (line.startsWith('DTEND')) {
            const datePart = line.split(':')[1];
            currentEvent.endDate = parseDate(datePart);
        } else if (line.startsWith('LOCATION:')) {
            currentEvent.location = line.substring(9);
        } else if (line.startsWith('UID:')) {
            currentEvent.id = line.substring(4);
        }
    }

    return events;
};
