import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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

const formValidation = yup
  .object()
  .shape({
    username: yup
      .string()
      .test(
        "minLength",
        "the character must be more than 3 character",
        (val: any) => val.length >= 3
      )
      .required("the username is required"),
    email: yup
      .string()
      .email("email format is incorrect")
      .required("email is required"),
    password: yup
      .string()
      .test(
        "minLen",
        "the password should contain more than 8 character",
        (val: any) => val.length >= 8
      )
      .required("password is required"),
    isMarried: yup.bool().required("isMarried is required"),
    gender: yup
      .string()
      .test(
        "checkGender",
        "enter valid gender",
        (val: any) => !val || !["Male", "Female"].includes(val)
      ),
  })
  .required();

const forms: FormType[] = [
  {
    name: "username",
    text: "Username",
    id: "username",
    type: "text",
    // rules: {
    //   required: {
    //     value: true,
    //     message: "the username is required",
    //   },
    //   minLength: {
    //     value: 3,
    //     message: "your username must contain at least 3 character",
    //   },
    // },
  },
  {
    name: "email",
    text: "Email Address",
    id: "email",
    type: "email",
    // rules: {
    //   required: {
    //     value: true,
    //     message: "the email address is required",
    //   },
    //   pattern: {
    //     value: /[a-z0-9]+@[a-z]+.[a-z]{2,3}/,
    //     message: "email is incorrect format",
    //   },
    // },
  },
  {
    name: "password",
    text: "Password",
    id: "password",
    type: "password",
    // rules: {
    //   required: {
    //     value: true,
    //     message: "the password is required",
    //   },
    //   minLength: {
    //     value: 8,
    //     message: "your password must contain at least 8 character",
    //   },
    // },
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
    // rules: {
    //   validate: (value: any) => {
    //     if (!value) return "enter your gender";
    //   },
    // },
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
    resolver: yupResolver(formValidation) as any,
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
