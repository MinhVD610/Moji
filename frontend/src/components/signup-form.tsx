import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {z} from "zod";
import { Input } from "@/components/ui/input"
import { Label } from "./ui/label"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  username: z.string().min(3, "Username must be at least 3 characters long").max(100),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long").max(100)
});

type SignupFormValues= z.infer<typeof signupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      // Call your API to create a new user
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      // Handle successful signup (e.g., redirect to login page)
      console.log("Account created successfully");
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">

              {/* header-logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img
                    src="/logo.svg"
                    alt="Logo"
                  />
                </a>
                <h1 className="text-2xl font-bold ">
                  Create an account
                </h1>
                <p className="text-muted-foreground text-balance">
                  Enter your email below to create your account
                </p>
                </div>

              {/* ho & ten  */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="block text-sm">
                    Họ
                  </Label>
                  <Input 
                  type="text" 
                  id="lastname" 
                  placeholder="Last Name" 
                  {...register("lastName")} />
                  
                  {errors.lastName && (
                    <p className="text-destructive text-sm ">
                      {errors.lastName.message}
                    </p>
                  )}

                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="block text-sm">
                    Tên
                  </Label>
                  <Input 
                    type="text" 
                    id="firstName" 
                    placeholder="First Name" 
                    {...register("firstName")} />
                  
                  {errors.firstName && (
                    <p className="text-destructive text-sm ">
                      {errors.firstName.message}
                    </p>
                  )}

                </div>
              </div>

              {/* user name */}
              <div className="flex flex-col gap-3">
                  <Label htmlFor="username" className="block text-sm">
                    Tên người dùng
                  </Label>
                  <Input 
                    type="text" 
                    id="username" 
                    placeholder="Username" 
                    {...register("username")} />
                  
                  {errors.username && (
                    <p className="text-destructive text-sm ">
                      {errors.username.message}
                    </p>
                  )}

              </div>

              {/* email */}
              <div className="flex flex-col gap-3">
                  <Label htmlFor="email" className="block text-sm">
                    Email
                  </Label>
                  <Input 
                    type="text" 
                    id="email" 
                    placeholder="Email" 
                    {...register("email")} />

                  {errors.email && (
                    <p className="text-destructive text-sm ">
                      {errors.email.message}
                    </p>
                  )}
                  
              </div>

              {/* password */}
              <div className="flex flex-col gap-3">
                  <Label htmlFor="password" className="block text-sm">
                    Password
                  </Label>
                  <Input 
                    type="password" 
                    id="password" 
                    placeholder="Password" 
                    {...register("password")} />

                  {errors.password && (
                    <p className="text-destructive text-sm ">
                      {errors.password.message}
                    </p>
                  )}
                  
              </div>

              {/* nut dang ky */}
              <Button type="submit" 
              className="w-full 
              disabled={isSubmitting}">
                Create Account
              </Button>

              <div className="text-center text-sm "></div>
                Already have an account? {" "}
                <a href="/signin" className="underline underline-offset-4">
                  Login
                </a>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholderSignup.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover "
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *[a]: hover:text-primary text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
