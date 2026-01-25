"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/modules/user/store/authReducer";
import { validateLogin } from "@/modules/user/utils/validateAuth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const InputField = ({
  icon: Icon,
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
  children,
}) => (
  <div className="space-y-1">
    <div className={`relative ${error ? "mb-1" : ""}`}>
      {/* LEFT ICON */}
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

      {/* INPUT */}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full py-3 pl-10 pr-10 border rounded-lg transition duration-200 ${
          error
            ? "border-red focus:border-red focus:ring-red"
            : "border-gray-300 focus:ring-main focus:border-main"
        } placeholder-gray-500`}
        placeholder={placeholder}
      />

      {/* CHILDREN (password eye icon) */}
      {children && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {children}
        </div>
      )}
    </div>

    {error && <p className="text-red text-sm ml-1">{error}</p>}
  </div>
);

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    const fieldErrors = validateLogin(updated);
    setErrors(fieldErrors);
  };

  const getLoginPayload = (value, password) => {
    const trimmedValue = value.trim();
    const isEmail = /\S+@\S+\.\S+/.test(trimmedValue);
    const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    const isPhone = bdPhoneRegex.test(trimmedValue);

    if (!isEmail && !isPhone) {
      return { error: "Invalid email or phone format." };
    }

    return {
      email: isEmail ? trimmedValue : null,
      phone: isPhone ? trimmedValue : null,
      password: password,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const payload = getLoginPayload(formData.emailOrPhone, formData.password);
    if (payload.error) {
      toast.error(payload.error);
      return;
    }

    // loginUser thunk
    const result = await dispatch(loginUser(payload));
    if (loginUser.rejected.match(result)) {
      toast.error(result.payload || "Login failed");
      return;
    }

    toast.success("Login Successful!");
    router.push("/user/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* EMAIL OR PHONE */}
      <div>
        <label
          htmlFor="emailOrPhone"
          className="block text-sm font-semibold mb-2"
        >
          Email or Phone
        </label>
        <InputField
          icon={Mail}
          type="text"
          name="emailOrPhone"
          value={formData.emailOrPhone}
          onChange={handleChange}
          placeholder="Enter email or phone number"
          error={errors.emailOrPhone}
        />
      </div>

      {/* PASSWORD */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="password" className="block text-sm font-semibold">
            Password
          </label>
          <Link
            prefetch={false}
            href="/user/forgot-password"
            className="text-sm font-medium text-main hover:text-mainHover transition duration-200"
          >
            Forgot Password?
          </Link>
        </div>
        <InputField
          icon={Lock}
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
        >
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition duration-200"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </InputField>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-main text-white py-3 rounded-lg font-bold text-lg tracking-wide hover:bg-mainHover transition duration-300 flex items-center justify-center disabled:bg-main/40"
      >
        {loading ? "Please wait..." : "Sign In"}
        <ArrowRight className="ml-2 w-5 h-5" />
      </button>
    </form>
  );
}
