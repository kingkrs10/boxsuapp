import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { publicRoutes, privateRoutes } from './NavigationConfig';
import { ROUTES } from './routes';

export const NavigationContainer = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}

      {/* Protected Routes */}
      {privateRoutes.map(({ path, component: Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <Component />
            </ProtectedRoute>
          }
        />
      ))}

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={ROUTES.APP.HOME} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.APP.HOME} replace />} />
    </Routes>
  );
};