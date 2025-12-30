"use client";
import React, { useState } from "react";
import { Mail, ShieldCheck, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import axiosClient from "@/core/api/axiosClient";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: Request, 2: Verify, 3: New Password
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [passwords, setPasswords] = useState({ password: "", password_confirmation: "" });
    // STEP 1: Request OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axiosClient.post("/forgot/password", { email });
            toast.success(data.message);
            // CAPTURE THE OTP FROM RESPONSE
            if (data.otp) {
                setOtp(data.otp);
                // console.log("Testing OTP:", data.otp);
            }
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.error || "User not found");
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        // console.log("Verifying with:", { email, otp });
        try {
            // Create a verify-otp route in Laravel to check if OTP is valid
            await axiosClient.post("/otp/verify", { email, otp, purpose: 'password_reset' });
            toast.success("OTP Verified!");
            setStep(3);
        } catch (err) {
            toast.error("Invalid OTP code");
        } finally {
            setLoading(false);
        }
    };

    // STEP 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (passwords.password !== passwords.password_confirmation) return toast.error("Passwords do not match");

        setLoading(true);
        // console.log("Verifying with:", { email, otp, ...passwords });
        try {
            await axiosClient.post("/reset/password", { email, otp, ...passwords });
            toast.success("Password changed successfully!");
            window.location.href = "/user/login";
        } catch (err) {
            toast.error(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border mt-10">
            {/* STEP 1 UI */}
            {step === 1 && (
                <form onSubmit={handleRequestOtp} className="space-y-5">
                    <h2 className="text-xl font-bold">Forgot Password?</h2>
                    <p className="text-gray-500 text-sm">Enter your email or phone to receive an OTP.</p>
                    <input
                        type="text"
                        className="w-full p-3 border rounded-lg"
                        placeholder="Email or Phone"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button disabled={loading} className="w-full bg-main text-white py-3 rounded-lg">
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>
            )}

            {/* STEP 2 UI */}
            {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <h2 className="text-xl font-bold">Verify OTP</h2>
                    {/* FOR TESTING ONLY: Display the OTP received from API */}
                    {/* {otp && (
                        <div className="bg-orange-50 border border-orange-200 p-2 rounded text-sm text-orange-700">
                            <strong>Test Mode:</strong> Your OTP is <code>{otp}</code>
                        </div>
                    )} */}
                    <p className="text-gray-500 text-sm">Enter the code sent to {email}</p>
                    <input
                        type="text"
                        className="w-full p-3 border rounded-lg text-center tracking-[1em] font-bold"
                        // maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button disabled={loading} className="w-full bg-main text-white py-3 rounded-lg">
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
            )}

            {/* STEP 3 UI */}
            {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-5">
                    <h2 className="text-xl font-bold">New Password</h2>
                    <input
                        type="password"
                        className="w-full p-3 border rounded-lg"
                        placeholder="New Password"
                        onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        className="w-full p-3 border rounded-lg"
                        placeholder="Confirm Password"
                        onChange={(e) => setPasswords({ ...passwords, password_confirmation: e.target.value })}
                        required
                    />
                    <button disabled={loading} className="w-full bg-main text-white py-3 rounded-lg">
                        Update Password
                    </button>
                </form>
            )}
        </div>
    );
}