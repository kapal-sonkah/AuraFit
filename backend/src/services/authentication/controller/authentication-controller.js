import InvariantError from "../../../exceptions/invariant-error.js";
import UserRepositories from "../../users/repositories/user-repositories.js";
import AuthenticationRepositories from '../repositories/authentication-repositories.js';
import TokenManager from '../../../security/token-manager.js';
import AuthenticationError from "../../../exceptions/authentication-error.js";
import response from "../../../utils/response.js";

export const login = async (req, res, next) => {
  try {
    const { username_email, password } = req.body;
    const userId = await UserRepositories.verifyUserCredential(username_email, password);
  
    if (!userId) {
      return next(new AuthenticationError('Incorrect Credentials'));
    }
  
    const accessToken = TokenManager.generateAccessToken({ id: userId });
    const refreshToken = TokenManager.generateRefreshToken({ id: userId });
  
    await AuthenticationRepositories.addRefreshToken(refreshToken);
    return response(res, 200, 'Authentication Successfully Added', { accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  const result = await AuthenticationRepositories.verifyRefreshToken(refreshToken);

  if (!result) return next(new InvariantError('Invalid Refresh Token'));

  const { id } = TokenManager.verifyRefreshToken(refreshToken);
  const accessToken = TokenManager.generateAccessToken({ id });

  return response(res, 200, 'Access Token updated successfully', { accessToken });
};

export const logout = async (req, res, next) => {
  const { refreshToken } = req.body;

  const result = await AuthenticationRepositories.verifyRefreshToken(refreshToken);

  if (!result) return next(new InvariantError('Invalid Refresh Token'));

  await AuthenticationRepositories.deleteRefreshToken(refreshToken);
  return response(res, 200, 'Refresh Token Deleted Successfully');
};

