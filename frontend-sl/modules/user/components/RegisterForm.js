"use client";

import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Phone } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/modules/user/store/registerReducer";

import { validateRegister } from "@/modules/user/utils/validateAuth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { setUserFromToken } from "@/modules/user/store/authReducer";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => state.register);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    emailOrPhone: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updated = { ...formData, [name]: value };
    setFormData(updated);

    const fieldErrors = validateRegister(updated);
    setErrors(fieldErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegister(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const input = formData.emailOrPhone.trim();

    let email = "";
    let phone = "";

    const isEmail = /\S+@\S+\.\S+/.test(input);
    const isBDPhone = /^(?:\+?88)?01[3-9]\d{8}$/.test(input);

    if (isEmail) email = input;
    else if (isBDPhone) phone = input;

    const result = await dispatch(
      registerUser({
        name: formData.name,
        email,
        phone,
        password: formData.password,
      })
    );

    if (registerUser.rejected.match(result)) {
      toast.error(result.payload || "Registration failed");
      return;
    }

    const payload = result.payload;

    dispatch(setUserFromToken(payload));

    toast.success("Registration successful!");
    router.push("/user/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* FULL NAME */}
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:ring-main focus:border-main ${
              errors.name ? "border-red" : "border-gray-300"
            }`}
          />
        </div>
        {errors.name && <p className="text-red text-sm mt-1">{errors.name}</p>}
      </div>

      {/* EMAIL OR PHONE */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Email or Phone (BD)
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
          <input
            type="text"
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleChange}
            placeholder="Enter email or phone number"
            className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:ring-main focus:border-main ${
              errors.emailOrPhone ? "border-red" : "border-gray-300"
            }`}
          />
        </div>
        {errors.emailOrPhone && (
          <p className="text-red text-sm mt-1">{errors.emailOrPhone}</p>
        )}
      </div>

      {/* PASSWORD */}
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={`w-full py-3 pl-10 pr-10 border rounded-lg focus:ring-main focus:border-main ${
              errors.password ? "border-red" : "border-gray-300"
            }`}
          />

          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* CONFIRM PASSWORD */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className={`w-full py-3 pl-10 pr-10 border rounded-lg focus:ring-main focus:border-main ${
              errors.confirmPassword ? "border-red" : "border-gray-300"
            }`}
          />

          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-main text-white py-3 rounded-lg font-semibold hover:bg-mainHover transition disabled:bg-main/40 flex items-center justify-center"
      >
        {loading ? "Please wait..." : "Create Account"}
        <ArrowRight className="ml-2" />
      </button>
    </form>
  );
}
