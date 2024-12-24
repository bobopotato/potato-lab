import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form
} from "@potato-lab/ui";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { ArrowLeftCircleIcon } from "lucide-react";
import Link from "next/link";
import { Loader } from "@potato-lab/ui";

interface CardFormProps<T extends FieldValues> {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  form: UseFormReturn<T>;
  isLoading?: boolean;
  previousPage?: string;
  onSubmit: (values: T) => void;
}

const CardForm = <T extends FieldValues>({
  title,
  description,
  children,
  footer,
  form,
  isLoading = false,
  previousPage,
  onSubmit
}: CardFormProps<T>) => {
  const _onSubmit = (values: T) => {
    onSubmit(values);
  };
  return (
    <Loader isLoading={isLoading}>
      <Card className="w-[35vw] bg-secondary">
        <CardHeader className="text-center">
          {previousPage && (
            <Link href={previousPage} className="w-fit">
              <ArrowLeftCircleIcon className="h-8 w-8" />
            </Link>
          )}
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(_onSubmit)}
            encType="multipart/form-data"
          >
            <CardContent className="pt-5 pb-10">
              <div className="grid w-full items-center gap-4">{children}</div>
            </CardContent>
            <CardFooter className="flex justify-between">{footer}</CardFooter>
          </form>
        </Form>
      </Card>
    </Loader>
  );
};

export default CardForm;
