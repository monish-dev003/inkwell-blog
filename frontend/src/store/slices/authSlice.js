import { createSlice } from '@reduxjs/toolkit'

const token = localStorage.getItem('inkwell_token')
const user  = (() => { try { return JSON.parse(localStorage.getItem('inkwell_user')) } catch { return null } })()

const authSlice = createSlice({
  name: 'auth',
  initialState: { user, token, isAuthenticated: !!token },
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user            = payload.user
      state.token           = payload.token
      state.isAuthenticated = true
      localStorage.setItem('inkwell_token', payload.token)
      localStorage.setItem('inkwell_user',  JSON.stringify(payload.user))
    },
    updateUser: (state, { payload }) => {
      state.user = payload
      localStorage.setItem('inkwell_user', JSON.stringify(payload))
    },
    clearCredentials: (state) => {
      state.user            = null
      state.token           = null
      state.isAuthenticated = false
      localStorage.removeItem('inkwell_token')
      localStorage.removeItem('inkwell_user')
    },
  },
})

export const { setCredentials, updateUser, clearCredentials } = authSlice.actions
export default authSlice.reducer
