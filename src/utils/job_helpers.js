function getTimestamp(value) {
  if (!value) {
    return null;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? null : timestamp;
}

export function isClosed(job) {
  return job.status === 'Completed' || job.status === 'Cancelled';
}

export function getOutstandingBalance(job) {
  
  if (job.agreedAmount === null) {
    return null;
  }

  return Math.max(0, job.agreedAmount - job.amountPaid);
}

export function isPaymentOverdue(job, now = Date.now()) {
  const balance = getOutstandingBalance(job);
  const dueAt = getTimestamp(job.paymentDueAt);

  return (
    job.status !== 'Cancelled' &&
    balance !== null &&
    balance > 0 &&
    dueAt !== null &&
    dueAt < now
  );
}

export function isFollowUpDue(job, now = Date.now()) {
  const followUpAt = getTimestamp(job.followUpAt);

  return (
    job.status !== 'Cancelled' &&
    Boolean(job.nextAction?.trim()) &&
    followUpAt !== null &&
    followUpAt <= now
  );
}

export function isWorkOverdue(job, now = Date.now()) {
  if (isClosed(job)) {
    return false;
  }

  const scheduledAt = getTimestamp(job.scheduledAt);

  if (scheduledAt === null) {
    return false;
  }

  if (job.dateType === 'Target completion') {
    return scheduledAt < now;
  }


  if (
    job.dateType === 'Appointment' &&
    Number.isFinite(job.durationMinutes) &&
    job.durationMinutes > 0
  ) {
    const expectedEnd =
      scheduledAt + job.durationMinutes * 60 * 1000;

    return expectedEnd < now;
  }

  return false;
}

export function getAttentionReasons(job, now = Date.now()) {
  const reasons = [];

  if (isPaymentOverdue(job, now)) {
    reasons.push('Payment overdue');
  }

  if (isWorkOverdue(job, now)) {
    reasons.push('Work overdue');
  }

  if (isFollowUpDue(job, now)) {
    reasons.push('Follow-up due');
  }

  const balance = getOutstandingBalance(job);

  if (
    job.status === 'Completed' &&
    balance !== null &&
    balance > 0 &&
    !isPaymentOverdue(job, now)
  ) {
    reasons.push('Payment outstanding');
  }

  return reasons;
}

export function getJobSummary(jobs, now = Date.now()) {
  const activeJobs = jobs.filter((job) => !isClosed(job));

  const attentionJobs = jobs.filter(
    (job) => getAttentionReasons(job, now).length > 0
  );

  const outstandingAmount = jobs.reduce((total, job) => {
    if (job.status === 'Cancelled') {
      return total;
    }

    return total + (getOutstandingBalance(job) ?? 0);
  }, 0);

  const overdueAmount = jobs.reduce((total, job) => {
    if (!isPaymentOverdue(job, now)) {
      return total;
    }

    return total + getOutstandingBalance(job);
  }, 0);

  return {
    activeCount: activeJobs.length,
    attentionCount: attentionJobs.length,
    outstandingAmount,
    overdueAmount,
  };
}