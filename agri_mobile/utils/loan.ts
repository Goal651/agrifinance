// Loan payment calculation utility
// M = P * (r(1 + r)^n) / ((1 + r)^n - 1)

export function calculateMonthlyPayment(principal: number, annualRate: number, months: number): number {
    const r = annualRate / 12 / 100;
    if (r === 0) return principal / months;
    return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}
