
function dateAt(dayOffset, hour, minute) {
  const date = new Date();

  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);

  return date.toISOString();
}

export const initialJobs = [
  {
    id: 'JOB-001',
    title: 'Two-bedroom home cleaning',
    serviceType: 'Cleaning',
    customerName: 'Sample Customer A',
    location: 'Kelaniya',
    description: 'Clean bedrooms, kitchen and living area.',

    scheduledAt: dateAt(-1, 9, 0),
    dateType: 'Appointment',
    durationMinutes: 180,

    status: 'Completed',
    agreedAmount: 6500,
    amountPaid: 1500,
    currency: 'LKR',
    paymentDueAt: dateAt(-1, 18, 0),

    nextAction: 'Follow up on the remaining payment.',
    followUpAt: dateAt(0, 10, 0),

    notes: 'Work completed. LKR 1,500 received.',
  },
  {
    id: 'JOB-002',
    title: 'Samsung Galaxy A54 charging issue',
    serviceType: 'Repair',
    customerName: 'Sample Customer B',
    location: 'Repair workshop',
    description: 'Inspect intermittent charging and explain findings.',

    scheduledAt: dateAt(1, 15, 30),
    dateType: 'Target completion',
    durationMinutes: null,

    status: 'Awaiting approval',
    agreedAmount: null,
    amountPaid: 0,
    currency: 'LKR',
    paymentDueAt: null,

    nextAction: 'Contact the customer about the LKR 4,500 estimate.',
    followUpAt: dateAt(0, 11, 0),

    notes: 'Estimate sent. Price is not agreed until the customer approves.',
  },
  {
    id: 'JOB-003',
    title: 'Small office cleaning',
    serviceType: 'Cleaning',
    customerName: 'Sample Customer C',
    location: 'Kiribathgoda',
    description: 'Clean work areas, pantry and washroom.',

    scheduledAt: dateAt(1, 10, 0),
    dateType: 'Appointment',
    durationMinutes: 120,

    status: 'Scheduled',
    agreedAmount: 4500,
    amountPaid: 1500,
    currency: 'LKR',
    paymentDueAt: dateAt(1, 18, 0),

    nextAction: 'Confirm property access before travelling.',
    followUpAt: dateAt(0, 16, 0),

    notes: 'Deposit received. Remaining amount: LKR 3,000.',
  },
  {
    id: 'JOB-004',
    title: 'iPhone 12 battery replacement',
    serviceType: 'Repair',
    customerName: 'Sample Customer D',
    location: 'Repair workshop',
    description: 'Replace the battery and complete the agreed checks.',

    scheduledAt: dateAt(-1, 16, 0),
    dateType: 'Target completion',
    durationMinutes: null,

    status: 'In progress',
    agreedAmount: 12000,
    amountPaid: 5000,
    currency: 'LKR',
    paymentDueAt: null,

    nextAction: 'Update the customer and agree on a revised completion time.',
    followUpAt: dateAt(0, 9, 30),

    notes: 'Target completion missed. Balance is payable on collection.',
  },
];