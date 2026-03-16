import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ======================================================================
// CONTEXT + GLOBALS
// ======================================================================
export const AuthContext = createContext();
let accessTokenMemory = null;
let isRefreshing = false;
let failedQueue = [];

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ======================================================================
// AXIOS INSTANCE
// ======================================================================
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true, // cookie refreshToken included automatically
});

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================================================
  // REFRESH ACCESS TOKEN (COOKIE BASED)
  // ======================================================================
  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await api.post("/auth/refresh-token");

      accessTokenMemory = res.data.accessToken;
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessTokenMemory}`;

      setUser(res.data.user);
      return accessTokenMemory;
    } catch (error) {
      console.log("Refresh failed:", error);
      accessTokenMemory = null;
      setUser(null);
      return null;
    }
  }, []);

  // ======================================================================
  // LOGOUT
  // ======================================================================
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log("Logout error:", error);
    }

    accessTokenMemory = null;
    setUser(null);
    navigate("/login");
  };

  // ======================================================================
  // AXIOS INTERCEPTORS
  // ======================================================================
  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessTokenMemory) {
          config.headers["Authorization"] = `Bearer ${accessTokenMemory}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return api(originalRequest);
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken = await refreshAccessToken();
            processQueue(null, newToken);
            isRefreshing = false;

            if (!newToken) {
              logout();
              return Promise.reject(error);
            }

            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (err) {
            processQueue(err, null);
            isRefreshing = false;
            logout();
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshAccessToken]);

  // ======================================================================
  // AUTH
  // ======================================================================
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    accessTokenMemory = data.accessToken;
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessTokenMemory}`;

    setUser(data.user);
    return data.user;
  };

  const register = async ({ username, email, phone, address, password }) => {
    const { data } = await api.post("/auth/register", {
      username,
      email,
      phone,
      address,
      password,
    });

    return data;
  };

  const forgotPassword = async (email) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  };

  const resetPassword = async (token, newPassword) => {
    const { data } = await api.post(`/auth/reset-password/${token}`, {
      newPassword,
    });
    return data;
  };

  const handleGoogleLogin = async (credential) => {
    const { data } = await api.post("/auth/google-login", { credential });
    accessTokenMemory = data.accessToken;
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessTokenMemory}`;
    setUser(data.user);
    return data.user;
  };

  // ======================================================================
  // PROFILE
  // ======================================================================
  const getProfile = async () => {
    const { data } = await api.get("/user/profile");
    return data;
  };

  const updateProfile = async (updatedData) => {
    const { data } = await api.put("/user/profile", updatedData);
    setUser(data.user);
    return data;
  };

  const deleteProfile = async () => {
    await api.delete("/user/profile");
    accessTokenMemory = null;
    setUser(null);
  };

  // ======================================================================
  //  SERVICE
  // ======================================================================
  const getServices = async () => {
    const { data } = await api.get("/services");
    return data;
  };

  const createService = async (serviceData) => {
    const { data } = await api.post("/services", serviceData);
    return data;
  };

  const updateService = async (serviceId, serviceData) => {
    const { data } = await api.put(`/services/${serviceId}`, serviceData);
    return data;
  };

  const deleteService = async (serviceId) => {
    await api.delete(`/services/${serviceId}`);
  };

  // ======================================================================
  //  CONTACT
  // ======================================================================
  const contactForm = async (formData) => {
    const { data } = await api.post("/auth/contact", formData);
    return data;
  };

  // ======================================================================
  // INITIAL AUTO LOGIN from COOKIE
  // ======================================================================
  useEffect(() => {
    const init = async () => {
      await refreshAccessToken(); // if cookie valid → auto login
      setLoading(false);
    };
    init();
  }, [refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        forgotPassword,
        resetPassword,
        handleGoogleLogin,
        logout,
        getProfile,
        updateProfile,
        deleteProfile,
        getServices,
        createService,
        updateService,
        deleteService,
        contactForm,
        api,
        accessTokenMemory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
