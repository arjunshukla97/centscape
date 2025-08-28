import { Request, Response } from 'express';
import { fetchPreview } from '../services/preview.service';
import { isPublicUrl } from '../utils/utils';
import { successResponse, errorResponse } from '../utils/response';

export async function previewHandler(req: Request, res: Response) {
  const { url } = req.body;

  if (!url) return res.status(400).json(errorResponse(400, 'Missing URL'));
  if (!isPublicUrl(url)) return res.status(400).json(errorResponse(400, 'URL is private or invalid'));

  try {
    const previewData = await fetchPreview(url);
    if (previewData.success) return res.json(successResponse(200, previewData.data));
    return res.json(errorResponse(previewData.status, previewData.error?.message || 'Failed to fetch preview'));
  } catch (err: any) {
    return res.json(errorResponse(500, err.message));
  }
}
