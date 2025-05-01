
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import React from 'react';

const badgeVariants = cva(
	'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
				secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
				destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
				outline: 'text-foreground',
        // Custom Status Colors
        created: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        no_response: 'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        injoignable: 'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        faux_numero: 'border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
        confirmed: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        pick_listed: 'border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        packed: 'border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
        ready_to_ship: 'border-transparent bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
        shipped_to_courier: 'border-transparent bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
        delivered: 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
        returned: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        cancelled: 'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        deleted: 'border-transparent bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

function Badge({ className, variant, ...props }) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };

