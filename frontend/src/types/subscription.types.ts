export interface Plan {
  id: string;
  name: string;
  price: number;
  monthlyBookings: number;
  employees: number;
  features: string[];
}

export interface CurrentPlan extends Plan {
  plan: string;
  currentMonthBookings: number;
  employeeCount: number;
  usagePercent: number;
}
