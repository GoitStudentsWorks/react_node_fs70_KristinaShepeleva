import { toast } from 'react-toastify';
import instance from '../instance';
import { createAsyncThunk } from '@reduxjs/toolkit';

const token = {
  set(token) {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset() {
    instance.defaults.headers.common.Authorization = '';
  },
};

// instance.interceptors.response.use(
//   response => response,
//   async (error, thunkAPI) => {
//     if (error.response.status === 401) {
//       console.log(error, 'error');
//       const state = thunkAPI.getState();
//       const refreshToken = state.auth.refreshToken;
//       thunkAPI.dispatch(fetchRefreshToken({ refreshToken }));
//       return instance(error.config);
//     }
//     return Promise.reject(error);
//   }
// );

export const fetchRefreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, thunkAPI) => {
    try {
      const response = await instance.post('/api/auth/refresh', {
        refreshToken: thunkAPI.getState().auth.refreshToken,
      });

      const newAccessToken = response.data.accessToken;
      console.log(newAccessToken);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// instance.interceptors.response.use(
//   response => response,
//   async (error, thunkAPI) => {
//     if (error.response.status === 401) {
//       console.log(error, 'error');
//       // const state = thunkAPI.getState();
//       // const { refreshToken } = useAuth();
//       // const refreshToken = state.auth.refreshToken;
//       const refreshToken = useSelector(state => state.auth.refreshToken);
//       // console.log(state, 'state');
//       const { data } = await instance.post('/api/auth/refresh', {
//         refreshToken,
//       });
//       token.set(data.accessToken);
//       console.log(data);
//       return instance(error.config);
//     }
//   }
// );

export const createUser = createAsyncThunk(
  'auth/createUser',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await instance.post('/api/auth/register', credentials);
      // const { data } = await axios.post('/api/auth/register', credentials);

      token.set(data.accessToken);
      return data;
    } catch (e) {
      const res = e.response;
      console.log(res.data.message);
      return thunkAPI.rejectWithValue({
        message: res.data.message,
        status: res.status,
      });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await instance.post('/api/auth/login', credentials);
      // const { data } = await axios.post('/api/auth/login', credentials);

      token.set(data.accessToken);
      return data;
    } catch (e) {
      console.log(e);
      const res = e.response;
      console.log(res.data.message);
      return thunkAPI.rejectWithValue({
        message: res.data.message,
        status: res.status,
      });
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    const { data } = await instance.post('/api/auth/logout');
    // const { data } = await axios.post('/api/auth/logout');

    token.unset();
    return data;
  } catch (e) {
    const res = e.response;
    console.log(res.data.message);
    return thunkAPI.rejectWithValue({
      message: res.data.message,
      status: res.status,
    });
  }
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await instance.patch('/api/user/update', credentials);
      // const { data } = await axios.patch('/api/user/update', credentials);

      return data;
    } catch (e) {
      return thunkAPI.rejectWithValue(
        toast.error('The info was not updated. Try later', { draggable: false })
      );
    }
  }
);
export const getCurrentUser = createAsyncThunk(
  'auth/current',
  async (_, thunkAPI) => {
    try {
      const { data } = await instance.get('/api/user/current');
      // const { data } = await axios.get('/api/user/current');

      return data;
    } catch (e) {
      const res = e.response;
      return thunkAPI.rejectWithValue(res.status);
    }
  }
);

export const updateUserAvatar = createAsyncThunk(
  'auth/updateUserAvatar',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await instance.patch(
        '/api/user/update/avatar',
        credentials
      );
      // const { data } = await axios.patch(
      //   '/api/user/update/avatar',
      //   credentials
      // );
      return data;
    } catch (e) {
      return thunkAPI.rejectWithValue(
        toast.error('The avatar was not updated. Try later', {
          draggable: false,
        })
      );
    }
  }
);
