import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service';
import { sendSuccess } from '../utils/response.util';

const getUserIdCondition = (req: Request) => {
  return req.user?.role === 'ADMIN' ? undefined : req.user!.id;
};

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdCondition(req);
    const summary = await analyticsService.getSummary(userId);
    sendSuccess(res, 200, summary);
  } catch (error) {
    next(error);
  }
};

export const getTrends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdCondition(req);
    const trends = await analyticsService.getMonthlyTrends(userId);
    sendSuccess(res, 200, trends);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdCondition(req);
    const categories = await analyticsService.getCategoryBreakdown(userId);
    sendSuccess(res, 200, categories);
  } catch (error) {
    next(error);
  }
};

export const getRecentTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdCondition(req);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const recent = await analyticsService.getRecentTransactions(limit, userId);
    sendSuccess(res, 200, recent);
  } catch (error) {
    next(error);
  }
};
