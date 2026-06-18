import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useSelector(s => s.auth);
  const location = useLocation();
  return userInfo ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
