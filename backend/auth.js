export function notImplemented(_req, res) {
    res.status(501).json({ error: 'Auth no implementado aún' });
  }