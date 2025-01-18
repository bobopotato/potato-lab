"use client";

import { cn } from "@potato-lab/lib/utils";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from "@potato-lab/ui";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { MouseEvent, useState } from "react";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

interface PasswordFieldValues extends FieldValues {
  password: string;
  confirmPassword?: string;
}

const PasswordField = <T extends PasswordFieldValues>({
  form,
  isConfirmPassword = false
}: {
  form: UseFormReturn<T>;
  isConfirmPassword?: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = (e: MouseEvent) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const name = (
    isConfirmPassword ? "confirmPassword" : "password"
  ) as FieldPath<T>;

  return (
    <div className="relative">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-1.5 relative">
            <FormLabel htmlFor={name}>
              {isConfirmPassword ? "Confirm Password" : "Password"}
            </FormLabel>
            <FormControl className="relative">
              <Input
                id={name}
                type={showPassword ? "text" : "password"}
                className="pr-12"
                autoComplete={name}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        size="icon"
        className="absolute bg-transparent shadow-none cursor-pointer invert right-1 top-5 scale-[1.5] hover:bg-transparent"
        onClick={(e) => toggleShowPassword(e)}
        asChild
      >
        <div>
          <EyeIcon className={cn(" scale-100", showPassword && "scale-0")} />
          <EyeClosedIcon
            className={cn("absolute scale-0", showPassword && "scale-100")}
          />
        </div>
      </Button>
    </div>
  );
};

export default PasswordField;
