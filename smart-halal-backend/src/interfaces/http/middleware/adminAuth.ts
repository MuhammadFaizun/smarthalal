import { Request, Response, NextFunction } from 'express';

export function requireAdminKey(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['x-admin-key'];
  const validKey = process.env.ADMIN_SECRET_KEY;

  if (!validKey) {
    return res.status(500).json({ success: false, message: 'Server misconfiguration: ADMIN_SECRET_KEY tidak diset.' });
  }

  if (!key || key !== validKey) {
    return res.status(401).json({ success: false, message: 'Akses ditolak. API key tidak valid.' });
  }

  next();
}
