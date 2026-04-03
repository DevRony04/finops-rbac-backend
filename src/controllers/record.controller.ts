import { Request, Response, NextFunction } from 'express';
import { recordService } from '../services/record.service';
import { sendSuccess } from '../utils/response.util';

export const createRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await recordService.createRecord(req.body);
    sendSuccess(res, 201, record, 'Record created successfully');
  } catch (error) {
    next(error);
  }
};

export const getRecords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user?.role === 'ADMIN';
    const requesterId = req.user!.id;
    // @ts-ignore
    const records = await recordService.getRecords(req.query, requesterId, isAdmin);
    sendSuccess(res, 200, records);
  } catch (error) {
    next(error);
  }
};

export const getRecordById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user?.role === 'ADMIN';
    const requesterId = req.user!.id;
    const record = await recordService.getRecordById(req.params.id, requesterId, isAdmin);
    sendSuccess(res, 200, record);
  } catch (error) {
    next(error);
  }
};

export const updateRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body);
    sendSuccess(res, 200, record, 'Record updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await recordService.deleteRecord(req.params.id);
    sendSuccess(res, 200, null, 'Record deleted successfully');
  } catch (error) {
    next(error);
  }
};
