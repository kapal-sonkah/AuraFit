import jwt from 'jsonwebtoken';
import InvariantError from '../exceptions/invariant-error.js';
import AuthenticationError from '../exceptions/authentication-error.js';

const TokenManager = {
  generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '3h' }),
  generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      return payload;
    } catch (error) {
      console.log(error);
      throw new InvariantError('Sesi sudah berakhir. Silakan masuk kembali.');
    }
  },
  verifyAccessToken: (accessToken, secret) => {
    try {
      const payload = jwt.verify(accessToken, secret);
      return payload;
    } catch (error) {
      throw new AuthenticationError('Sesi sudah berakhir. Silakan masuk kembali.');
    }
  }
};

export default TokenManager;