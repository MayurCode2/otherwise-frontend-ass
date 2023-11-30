import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const authStatus = useSelector((state) => state.auth.authStatus);
  const dispatch = useDispatch();
  const navigation = useNavigate();

  useEffect(() => {
    if (authStatus === "fulfilled") {
      // Redirect to login page after successful registration
      navigation("/");
      // Reset form fields
      setFormData({
        username: "",
        password: "",
      });
    }
  }, [authStatus]);
  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }
    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormErrors({
      ...formErrors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      setFormErrors({});
      setLoading(true);

      try {
        await dispatch(
          loginUser({
            username: formData.username,
            password: formData.password,
          })
        );
      } catch (error) {
        console.error("Error during login:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setFormErrors(errors);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white shadow-md rounded-lg p-8 w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
          <h2 className="text-center text-3xl text-primaryblue font-semibold mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                username:
              </label>
              <input
                className="w-full h-10 border border-gray-300 rounded p-2"
                type="username"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username"
              />
              {formErrors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.username}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password:
              </label>
              <input
                className="w-full h-10 border border-gray-300 rounded p-2"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.password}
                </p>
              )}
            </div>
            <div className="flex justify-center">
              <button
                className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
            <div className="text-center mt-4">
              <span className="text-gray-600">Don't have an account?</span>
              <Link
                to="/register"
                className="text-primaryblue hover:text-blue-700 transition"
              >
                {" "}
                Register
              </Link>
            </div>
          </form>
          {authStatus === "error" && (
            <p className="text-red-500 text-xs mt-4">
              Error occurred during login.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
