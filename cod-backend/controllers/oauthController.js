export function oauthSuccess(req, res) {
    const token = req.user ? req.user.id : null;
    if (token) {
      res.redirect(`/auth-success?token=${token}`);
    } else {
      res.redirect('/auth-failure');
    }
  }

  export function oauthFailure(req, res) {
    res.status(401).json({ error: 'Social login failed' });
  }
