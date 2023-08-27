import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type FormTypeValidationValue =
  | { message: string; value: any }
  | ((value: any) => any);

export interface FormType {
  name: string;
  text?: string;
  id?: string;
  type: string;
  options?: { text: string; value: string }[];
  rules?: { [key: string]: FormTypeValidationValue };
}

export interface FormValues {
  username: string;
  email: string;
  password: string;
  isMarried: boolean;
  gender: string;
}

const formValidation = z.object({
  username: z
    .string()
    .min(3, "the character must be more than 3 character")
    .nonempty("the username is required"),
  email: z
    .string()
    .email("email format is incorrect")
    .nonempty("email is required"),
  password: z
    .string()
    .min(8, "the password should contain more than 8 character")
    .nonempty("password is required"),
  gender: z.union([z.literal("male"), z.literal("female")]),
});

const forms: FormType[] = [
  {
    name: "username",
    text: "Username",
    id: "username",
    type: "text",
  },
  {
    name: "email",
    text: "Email Address",
    id: "email",
    type: "email",
  },
  {
    name: "password",
    text: "Password",
    id: "password",
    type: "password",
  },
  {
    name: "isMarried",
    text: "Is Married Before",
    id: "isMarried",
    type: "checkbox",
  },
  {
    type: "radio",
    name: "gender",
    options: [
      {
        text: "Male",
        value: "male",
      },
      {
        text: "Female",
        value: "female",
      },
    ],
  },
];

export default function App() {
  const { register, formState, handleSubmit } = useForm<FormValues>({
    criteriaMode: "firstError",
    reValidateMode: "onChange",
    resolver: zodResolver(formValidation) as any,
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {forms.map((form) => (
          <div key={form.id}>
            <label htmlFor={form.id}>{form.text}</label>
            {form.type !== "radio" && (
              <input
                type={form.type}
                id={form.id}
                {...register(form.name as any, form.rules)}
              />
            )}
            {form.type === "radio" && (
              <>
                {form.options?.map((option) => (
                  <div key={option.value}>
                    <label>{option.text}</label>
                    <input
                      type="radio"
                      {...register(form.name! as any, form.rules)}
                      value={option.value}
                    />
                  </div>
                ))}
              </>
            )}

            {(formState?.errors as any)?.[form.name]?.message && (
              <span>
                {(formState?.errors as any)?.[form.name]?.message?.toString()}
              </span>
            )}
          </div>
        ))}
        <button>submit</button>
      </form>
    </div>
  );
}
