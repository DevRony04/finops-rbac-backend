import { prisma } from '../config/database';

export class AnalyticsService {
  async getSummary(userId?: string) {
    const where = userId ? { userId } : {};

    const [incomeResult, expenseResult] = await Promise.all([
      prisma.record.aggregate({
        where: { ...where, type: 'INCOME' },
        _sum: { amount: true },
      }),
      prisma.record.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = incomeResult._sum.amount || 0;
    const totalExpenses = expenseResult._sum.amount || 0;

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
    };
  }

  async getRecentTransactions(limit = 10, userId?: string) {
    const where = userId ? { userId } : {};
    
    return prisma.record.findMany({
      where,
      take: limit,
      orderBy: { date: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      },
    });
  }

  async getCategoryBreakdown(userId?: string) {
    const where = userId ? { userId } : {};

    const records = await prisma.record.groupBy({
      by: ['category', 'type'],
      where,
      _sum: { amount: true },
    });

    const breakdown = records.map(r => ({
      category: r.category,
      type: r.type,
      total: r._sum.amount || 0,
    }));

    return breakdown;
  }

  async getMonthlyTrends(userId?: string) {
    // Generate trends for the last 6 months using raw query or application side aggregation
    // For simplicity and database independence, we'll fetch last 6 months data and group in JS
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const where: any = {
      date: { gte: sixMonthsAgo },
    };
    if (userId) where.userId = userId;

    const records = await prisma.record.findMany({
      where,
      select: { date: true, amount: true, type: true },
    });

    const monthlyData: Record<string, { income: number; expense: number }> = {};

    records.forEach(record => {
      const monthYear = `${record.date.getFullYear()}-${String(record.date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthYear]) {
         monthlyData[monthYear] = { income: 0, expense: 0 };
      }
      if (record.type === 'INCOME') {
        monthlyData[monthYear].income += record.amount;
      } else {
        monthlyData[monthYear].expense += record.amount;
      }
    });

    // Format for response
    return Object.keys(monthlyData).sort().map(month => ({
      month,
      income: monthlyData[month].income,
      expense: monthlyData[month].expense,
      net: monthlyData[month].income - monthlyData[month].expense
    }));
  }
}
export const analyticsService = new AnalyticsService();
