import { createSlice } from '@reduxjs/toolkit'
import { login, verifyLogin } from '../services/login'
import { setToken } from '../services/movies'
import { setNotification } from './notificationReducer'
import { getInitialMovies } from './moviesReducer'

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    token: null,
    username: null,
  },
  reducers: {
    setAdmin(state, action) {
      setToken(action.payload.adminToken)
      state.token = action.payload.adminToken
      state.username = action.payload.username
    },
    removeAdmin(state) {
      window.localStorage.removeItem('adminCinemaec')
      setToken(null)
      state.token = null
    },
  },
})

export const { setAdmin, removeAdmin } = adminSlice.actions

export const loginAdmin = ({ username, password }) => {
  return async dispatch => {
    try {
      const response = await login({ username, password })
      window.localStorage.setItem('adminCinemaec', JSON.stringify(response))
      dispatch(setAdmin(response))
    } catch (error) {
      console.error(error)
      dispatch(
        setNotification({
          message: 'usuario o contraseña incorrecta',
          style: 'error',
        }),
      )
    }
  }
}

export const verifyLoginToken = admin => {
  return async dispath => {
    try {
      await verifyLogin(admin.adminToken)
      dispath(setAdmin(admin))
      dispath(getInitialMovies())
    } catch (error) {
      dispath(removeAdmin())
    }
  }
}

export default adminSlice.reducer
