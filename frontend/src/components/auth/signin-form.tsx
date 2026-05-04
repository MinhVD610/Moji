import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {z} from "zod";
import { Input } from "@/components/ui/input"
import { Label } from "../ui/label"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const signInSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(100),
    password: z.string().min(6, "Password must be at least 6 characters long").max(100)
}); 

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm({
  className,
  ...props  }: React.ComponentProps<"div">) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema)
  });   

    const onSubmit = async (data: SignInFormValues) => {
        try {
            // Call your API to authenticate the user
            const response = await fetch("/api/signin", {       
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Failed to sign in");
            }

            // Handle successful sign-in (e.g., redirect to dashboard)
            console.log("Signed in successfully");
        } catch (error) {
            console.error("Error signing in:", error);
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
                        <img src="/favicon.svg" alt="Logo" />
                    </a>
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-muted-foreground text-balance">Enter your credentials to sign in to your account</p>
                </div>

                <div className="flex flex-col gap-3">
                        <Label htmlFor="username" className="block text-sm">Username</Label>
                        <Input type="text" id="username" placeholder="Username" {...register("username")} />
                        {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
                </div>
                    
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="password" className="block text-sm">Password</Label>
                        <Input type="password" id="password" {...register("password")} />
                        {errors.password &&( <p className="text-destructive text-sm">{errors.password.message}</p>)}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        Sign In
                    </Button>

                    <div className="text-sm text-center">
                        Don't have an account? <a href="/signup" className="underline underline-offset-4">Sign Up</a>
                    </div>
            </div>
            </form>
            <div className="bg-muted relative hidden md:block">
                <img src="/placeholder.png" alt="Sign In Illustration" className="h-full w-full object-cover" />
            </div>
        </CardContent>
      </Card>
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">By signing in, you agree to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.</p>
      </div>
    </div>
  );
}
