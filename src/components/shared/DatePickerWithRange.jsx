
import React, { useState } from 'react';
import { format, subDays, addDays } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
// Removed DateRange import as it's not a named export in v8 and only used as a type

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


export function DatePickerWithRange({ className, onDateChange }) {
	const defaultEndDate = new Date();
    const defaultStartDate = defaultEndDate; // Default to Today

    // The 'date' state object shape { from: Date | undefined, to?: Date | undefined }
    // corresponds to the DateRange type structure.
	const [date, setDate] = useState({
		from: defaultStartDate,
		to: defaultEndDate,
	});
    const [preset, setPreset] = useState("today");

    const handlePresetChange = (value) => {
        setPreset(value);
        let newDateRange = { from: undefined, to: undefined };
        const today = new Date();
        switch (value) {
            case "today":
                newDateRange = { from: today, to: today };
                break;
            case "yesterday":
                const yesterday = subDays(today, 1);
                newDateRange = { from: yesterday, to: yesterday };
                break;
            case "last7":
                newDateRange = { from: subDays(today, 6), to: today };
                break;
            case "last30":
                newDateRange = { from: subDays(today, 29), to: today };
                break;
            case "custom":
                 // Keep current date if switching to custom, otherwise reset
                 if (date.from && date.to) {
                    newDateRange = { from: date.from, to: date.to };
                 } else {
                    newDateRange = { from: today, to: today };
                 }
                break;
            default:
                 newDateRange = { from: today, to: today };
        }
         setDate(newDateRange);
         if (onDateChange) {
            onDateChange(newDateRange);
         }
    };

    const handleDateSelect = (selectedRange) => {
        // selectedRange already matches the { from: Date | undefined, to?: Date | undefined } structure
        setDate(selectedRange);
        setPreset("custom"); // Switch preset to custom when manual date is selected
        if (onDateChange) {
            onDateChange(selectedRange);
         }
    }

     React.useEffect(() => {
        // Set initial date on mount
        handlePresetChange("today");
     }, []);


	return (
		<div className={cn('grid gap-2', className)}>
            <div className="flex items-center gap-2">
                 <Select value={preset} onValueChange={handlePresetChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select preset" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="last7">Last 7 Days</SelectItem>
                        <SelectItem value="last30">Last 30 Days</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                </Select>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                        'w-[300px] justify-start text-left font-normal',
                        !date && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, 'LLL dd, y')} -{' '}
                            {format(date.to, 'LLL dd, y')}
                            </>
                        ) : (
                            format(date.from, 'LLL dd, y')
                        )
                        ) : (
                        <span>Pick a date</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateSelect}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
            </div>
		</div>
	);
}
