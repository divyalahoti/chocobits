import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector(s => s.auth);
  return userInfo && userInfo.role === 'admin' ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
