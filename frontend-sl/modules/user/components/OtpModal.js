// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { verifyOtp } from "@/modules/user/store/registerReducer";
// import { setUserFromToken } from "@/modules/user/store/authReducer";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import api from "@/core/api/axiosClient";

// export default function OtpModal() {
//   const { otpModal, email, phone, purpose } = useSelector(
//     (state) => state.register
//   );

//   const dispatch = useDispatch();
//   const router = useRouter();

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const inputRefs = useRef([]);

//   const [timeLeft, setTimeLeft] = useState(300);
//   const [timeLeftResend, setTimeLeftResend] = useState(60);

//   // Start timers when modal opens
//   useEffect(() => {
//     if (!otpModal) return;

//     setOtp(["", "", "", "", "", ""]);
//     setTimeLeft(300);
//     setTimeLeftResend(60);

//     const t1 = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     const t2 = setInterval(() => {
//       setTimeLeftResend((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     return () => {
//       clearInterval(t1);
//       clearInterval(t2);
//     };
//   }, [otpModal]);

//   if (!otpModal) return null;

//   const handleChange = (value, index) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const update = [...otp];
//     update[index] = value;
//     setOtp(update);

//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();

//     const paste = e.clipboardData
//       .getData("text")
//       .replace(/\D/g, "")
//       .slice(0, 6);

//     const digits = paste.split("");
//     const arr = ["", "", "", "", "", ""];

//     digits.forEach((d, i) => (arr[i] = d));
//     setOtp(arr);

//     const last = digits.length - 1;
//     if (last >= 0) inputRefs.current[last].focus();
//   };

//   const formatTime = (sec) => {
//     const m = Math.floor(sec / 60);
//     const s = sec % 60;
//     return `${m}:${s.toString().padStart(2, "0")}`;
//   };

//   const handleVerify = async () => {
//     const codeStr = otp.join("");

//     if (codeStr.length !== 6) {
//       toast.error("Enter 6 digit OTP");
//       return;
//     }

//     if (timeLeft <= 0) {
//       toast.error("OTP expired");
//       return;
//     }

//     const codeNumber = Number(codeStr);

//     const result = await dispatch(
//       verifyOtp({
//         email,
//         phone,
//         otp: codeNumber,
//         purpose,
//       })
//     );

//     if (verifyOtp.fulfilled.match(result)) {
//       toast.success("OTP Verified!");
//       dispatch(setUserFromToken(result.payload));
//       router.push("/user/dashboard");
//     } else {
//       toast.error(result.payload || "Invalid OTP");
//     }
//   };

//   const handleResend = async () => {
//     try {
//       await api.post("/otp/resend", {
//         purpose,
//         email,
//         phone,
//       });

//       toast.success(`OTP resent via ${phone ? "SMS" : "Email"}`);

//       setOtp(["", "", "", "", "", ""]);
//       inputRefs.current[0]?.focus();
//       setTimeLeftResend(60);
//       setTimeLeft(300);
//     } catch (err) {
//       toast.error("Failed to resend OTP");
//     }
//   };

//   return (
//     <div className="fixed top-20 inset-0 bg-black/50 flex items-center justify-center z-[9999]">
//       <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm">
//         <h2 className="text-xl font-semibold text-center">Verify OTP</h2>

//         <p className="text-gray-600 text-center mb-4">
//           OTP sent to {phone ? `📱 ${phone}` : `📩 ${email}`}
//         </p>

//         <p className="text-main font-semibold text-center mb-4">
//           Expires in: {formatTime(timeLeft)}
//         </p>

//         <div className="flex gap-2 justify-center mb-6">
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               value={digit}
//               maxLength="1"
//               className="w-10 h-12 text-xl border rounded-lg text-center"
//               ref={(el) => (inputRefs.current[index] = el)}
//               onChange={(e) => handleChange(e.target.value, index)}
//               onKeyDown={(e) => handleKeyDown(e, index)}
//               onPaste={index === 0 ? handlePaste : undefined}
//             />
//           ))}
//         </div>

//         <button
//           onClick={handleVerify}
//           className="w-full py-3 bg-main text-white rounded-xl mb-3"
//         >
//           Verify
//         </button>

//         <button
//           onClick={handleResend}
//           disabled={timeLeftResend > 0}
//           className="w-full py-2 border text-main rounded-xl disabled:text-gray-400"
//         >
//           {timeLeftResend > 0
//             ? `Resend in ${formatTime(timeLeftResend)}`
//             : "Resend OTP"}
//         </button>
//       </div>
//     </div>
//   );
// }

import React from "react";

export default function OtpModal() {
  return null;
}
