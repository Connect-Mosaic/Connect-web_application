import { api } from './client';
import auth from './auth-helper';

// User body example:{
//   "name": "tetUser",
//   "email": "tetUser@example.com",
//   "password": "mypassword123",
//   "role": "student",
//   "interests": ["AI", "Web Development", "Cooking"],
//   "university": "Centennial College",
//   "program": "Software Engineering",
//   "profilePicture": "https://example.com/avatar.jpg",
//   "bio": "I love building full-stack apps and exploring AI features.",
//   "location": "Toronto, Canada"
// }

export const register = async (user) => {
  const res = await api.post('/api/auth/register/', user);
  if (res.success && res.token) {
    auth.authenticate(res.data.token);
  }
  return res;
}
export const login = async (user, rememberMe) => {
  const res = await api.post('/api/auth/login/', { user, rememberMe });
  if (res.success && res.token) {
    auth.authenticate(res.data.token);
  }
  return res;
};

export const logout = async () => {
  auth.clearJWT();
  return await api.get('/api/auth/logout/');
};