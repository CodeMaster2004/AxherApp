import { useState, useRef } from "react";
import AuthInput from "@/features/auth/components/AuthInput";
import styles from "./AuthCard.module.css";

interface Props {
  length?: number;
  onChange?: (otp: string) => void;
  disabled?: boolean;
}

export default function OtpInputs({ length = 4, onChange, disabled = false }: Props) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, val: string) => {
    if (!/^[a-zA-Z0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    onChange?.(newOtp.join(""));

    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div style={{ display: "flex", gap: ".5em", justifyContent: "center", marginTop: "1em" }}>
      {Array.from({ length }).map((_, i) => (
        <AuthInput
          key={i}
          value={otp[i]}
          onChange={(val) => handleChange(i, val)}
          disabled={disabled}
          autoFocus={i === 0}
          placeholder="●"
          onKeyDown={(e) => handleKeyDown(e, i)}
          type="text"
          icon={null}
          ref={(el) => { inputsRef.current[i] = el; }}
          className={styles.otpInput}

        />
      ))}
    </div>
  );
}